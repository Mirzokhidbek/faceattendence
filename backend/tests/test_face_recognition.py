import numpy as np
from app.services.face_recognition_service import face_recognition_service, FaceDetectionStatus
from app.services.liveness_service import liveness_service

def test_face_service_initialization():
    assert face_recognition_service.detector is not None
    assert face_recognition_service.recognizer is not None
    assert len(face_recognition_service._cache) >= 15

def test_decode_invalid_base64():
    res = face_recognition_service.decode_base64_image("not-a-valid-base64-string")
    assert res is None

def test_detect_in_blank_image():
    blank = np.zeros((300, 300, 3), dtype=np.uint8)
    status, emb, info = face_recognition_service.detect_and_embed(blank)
    assert status == FaceDetectionStatus.NO_FACE
    assert emb is None

def test_vector_cache_matching():
    # Pick first student from cache
    student_id = list(face_recognition_service._cache.keys())[0]
    cached_emb = face_recognition_service._cache[student_id]["embedding"]
    
    # Matching exact embedding should return high confidence match
    student_match, confidence = face_recognition_service.search_match(cached_emb, threshold=0.40)
    assert student_match is not None
    assert student_match["student_db_id"] == student_id
    assert confidence >= 0.70

def test_vector_cache_unknown_face():
    # Random orthogonal vector should not match
    np.random.seed(9999)
    random_emb = np.random.randn(128).astype(np.float32)
    random_emb = random_emb / np.linalg.norm(random_emb)

    student_match, score = face_recognition_service.search_match(random_emb, threshold=0.75)
    assert student_match is None

def test_liveness_detection_on_solid_image():
    solid = np.ones((100, 100, 3), dtype=np.uint8) * 128
    result = liveness_service.evaluate_liveness(solid)
    # Solid image has zero texture/laplacian variance, should fail blur/flat test
    assert result["is_live"] is False
