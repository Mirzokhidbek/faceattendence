import os
import re
import base64
import logging
import uuid
from typing import Dict, List, Optional, Tuple, Any
import cv2
import numpy as np

from app.core.config import settings

logger = logging.getLogger(__name__)

class FaceDetectionStatus:
    SUCCESS = "success"
    NO_FACE = "no_face"
    MULTIPLE_FACES = "multiple_faces"
    INVALID_IMAGE = "invalid_image"

class FaceRecognitionService:
    def __init__(self):
        self.detector_path = os.path.join(settings.MODELS_DIR, "face_detection_yunet_2023mar.onnx")
        self.recognizer_path = os.path.join(settings.MODELS_DIR, "face_recognition_sface_2021dec.onnx")
        
        self.detector = None
        self.recognizer = None
        
        # In-memory vector cache:
        # student_cache[student_id] = {
        #     "student_db_id": str,
        #     "student_code": str,
        #     "full_name": str,
        #     "group_name": str,
        #     "embedding": np.ndarray shape (128,)
        # }
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._matrix_cache: Optional[np.ndarray] = None
        self._matrix_ids: List[str] = []
        
        self._initialize_models()

    def _initialize_models(self):
        if not os.path.exists(self.detector_path) or not os.path.exists(self.recognizer_path):
            logger.error(f"Model files not found in {settings.MODELS_DIR}")
            return
            
        try:
            self.detector = cv2.FaceDetectorYN.create(
                model=self.detector_path,
                config="",
                input_size=(320, 320),
                score_threshold=0.55,
                nms_threshold=0.3,
                top_k=5000
            )
            self.recognizer = cv2.FaceRecognizerSF.create(
                model=self.recognizer_path,
                config=""
            )
            logger.info("OpenCV YuNet and SFace models loaded successfully into FaceRecognitionService")
        except Exception as e:
            logger.error(f"Failed to load OpenCV face models: {e}")

    def decode_base64_image(self, base64_str: str) -> Optional[np.ndarray]:
        """Convert a base64 encoded image string to an OpenCV BGR image array."""
        try:
            if not base64_str:
                return None
            if "," in base64_str:
                base64_str = base64_str.split(",", 1)[1]
            image_data = base64.b64decode(base64_str)
            np_arr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            return img
        except Exception as e:
            logger.error(f"Error decoding base64 image: {e}")
            return None

    def detect_and_embed(self, image: np.ndarray) -> Tuple[str, Optional[np.ndarray], Optional[dict]]:
        """
        Detect faces in image and extract 128-dimensional embedding if exactly 1 face exists.
        Returns: (status, embedding_128d, face_info)
        """
        if image is None or image.size == 0:
            return FaceDetectionStatus.INVALID_IMAGE, None, None

        if self.detector is None or self.recognizer is None:
            self._initialize_models()
            if self.detector is None:
                return "models_uninitialized", None, None

        h, w = image.shape[:2]
        self.detector.setInputSize((w, h))
        
        _, faces = self.detector.detect(image)
        
        if faces is None or len(faces) == 0:
            return FaceDetectionStatus.NO_FACE, None, None
            
        # Filter faces by detection score (faces[:, -1])
        valid_faces = [f for f in faces if f[-1] >= 0.50]
        
        if len(valid_faces) == 0:
            return FaceDetectionStatus.NO_FACE, None, None
            
        if len(valid_faces) > 1:
            return FaceDetectionStatus.MULTIPLE_FACES, None, {
                "count": len(valid_faces),
                "faces": [{"box": [int(x) for x in f[:4]], "score": float(f[-1])} for f in valid_faces]
            }
            
        face = valid_faces[0]
        try:
            aligned_face = self.recognizer.alignCrop(image, face)
            feature = self.recognizer.feature(aligned_face)  # shape (1, 128)
            
            # Normalize embedding to unit length
            norm = np.linalg.norm(feature)
            if norm > 0:
                normalized_embedding = (feature / norm).astype(np.float32).flatten()
            else:
                normalized_embedding = feature.astype(np.float32).flatten()

            face_info = {
                "box": [int(x) for x in face[:4]],
                "confidence": float(face[-1]),
                "landmarks": [[int(face[i]), int(face[i+1])] for i in range(4, 14, 2)]
            }
            return FaceDetectionStatus.SUCCESS, normalized_embedding, face_info
        except Exception as e:
            logger.error(f"Face alignment/embedding failed: {e}")
            return "embedding_error", None, None

    def process_multi_angle_embeddings(self, images_base64: List[str]) -> Tuple[bool, Optional[np.ndarray], str]:
        """
        Generate a combined robust embedding from multi-angle images (Front, Left, Right).
        """
        embeddings = []
        for idx, b64 in enumerate(images_base64):
            if not b64:
                continue
            img = self.decode_base64_image(b64)
            if img is None:
                continue
            status, emb, _ = self.detect_and_embed(img)
            if status == FaceDetectionStatus.SUCCESS and emb is not None:
                embeddings.append(emb)
            elif status == FaceDetectionStatus.MULTIPLE_FACES:
                return False, None, f"Image {idx+1} contains multiple faces. Please provide a photo with only 1 person."
            elif status == FaceDetectionStatus.NO_FACE:
                return False, None, f"No clear face detected in photo {idx+1}."

        if not embeddings:
            return False, None, "No valid face embeddings could be extracted from provided photos."

        # Compute centroid embedding
        mean_embedding = np.mean(embeddings, axis=0)
        norm = np.linalg.norm(mean_embedding)
        if norm > 0:
            final_embedding = (mean_embedding / norm).astype(np.float32)
        else:
            final_embedding = mean_embedding.astype(np.float32)

        return True, final_embedding, "Embeddings combined successfully"

    def save_student_photo(self, student_code: str, image: np.ndarray) -> str:
        """Save a cropped or optimized JPEG photo to the upload directory and return its path."""
        try:
            filename = f"student_{student_code}_{uuid.uuid4().hex[:8]}.jpg"
            filepath = os.path.join(settings.UPLOAD_DIR, filename)
            
            # Resize image if too large for storage efficiency
            h, w = image.shape[:2]
            max_dim = 600
            if max(h, w) > max_dim:
                scale = max_dim / max(h, w)
                image = cv2.resize(image, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
                
            cv2.imwrite(filepath, image, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
            return f"/uploads/{filename}"
        except Exception as e:
            logger.error(f"Failed to save student photo: {e}")
            return ""

    # ==================== In-Memory Vector Cache ====================

    def update_cache(self, student_db_id: str, student_code: str, full_name: str, group_name: str, embedding: np.ndarray, photo_url: Optional[str] = None):
        """Add or update a student's embedding in the memory cache."""
        norm_emb = embedding / np.linalg.norm(embedding) if np.linalg.norm(embedding) > 0 else embedding
        self._cache[student_db_id] = {
            "student_db_id": student_db_id,
            "student_code": student_code,
            "full_name": full_name,
            "group_name": group_name,
            "photo_url": photo_url,
            "embedding": norm_emb.astype(np.float32)
        }
        self._rebuild_matrix()

    def remove_from_cache(self, student_db_id: str):
        """Remove a student from the vector cache."""
        if student_db_id in self._cache:
            del self._cache[student_db_id]
            self._rebuild_matrix()

    def _rebuild_matrix(self):
        """Rebuild stacked numpy array for vectorized parallel search."""
        self._matrix_ids = list(self._cache.keys())
        if self._matrix_ids:
            self._matrix_cache = np.vstack([self._cache[sid]["embedding"] for sid in self._matrix_ids])
        else:
            self._matrix_cache = None

    def search_match(self, query_embedding: np.ndarray, threshold: Optional[float] = None) -> Tuple[Optional[Dict[str, Any]], float]:
        """
        Fast vectorized cosine similarity matching against all cached student vectors.
        Returns (student_dict, match_score) where match_score is in [0.0, 1.0].
        """
        if self._matrix_cache is None or len(self._matrix_ids) == 0:
            return None, 0.0

        if threshold is None:
            threshold = settings.FACE_MATCH_THRESHOLD

        q_norm = query_embedding / np.linalg.norm(query_embedding) if np.linalg.norm(query_embedding) > 0 else query_embedding
        
        # Matrix dot product calculates cosine similarity for all students simultaneously
        similarities = np.dot(self._matrix_cache, q_norm)
        best_idx = int(np.argmax(similarities))
        best_score = float(similarities[best_idx])

        if best_score >= threshold:
            best_student_id = self._matrix_ids[best_idx]
            student_data = self._cache[best_student_id].copy()
            # Map cosine similarity to confidence percentage (e.g., 0.40 -> 75%, 0.70+ -> 95-99%)
            calibrated_confidence = float(np.clip((best_score - 0.20) / 0.70, 0.50, 0.99))
            return student_data, calibrated_confidence
        
        return None, float(max(0.0, best_score))

    def load_cache_from_db(self, db_students: List[Any]):
        """Populate in-memory cache from SQLAlchemy student records on app startup."""
        import json
        self._cache.clear()
        for s in db_students:
            try:
                emb_list = json.loads(s.face_embedding)
                emb_arr = np.array(emb_list, dtype=np.float32)
                self.update_cache(
                    student_db_id=str(s.id),
                    student_code=s.student_id,
                    full_name=s.full_name,
                    group_name=s.group_name,
                    embedding=emb_arr,
                    photo_url=s.photo_url
                )
            except Exception as e:
                logger.warning(f"Could not load embedding for student {s.student_id}: {e}")
        logger.info(f"Loaded {len(self._cache)} student face embeddings into memory cache.")

face_recognition_service = FaceRecognitionService()
