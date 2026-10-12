import cv2
import numpy as np
from typing import Dict, Any, Tuple

class LivenessDetectionService:
    """
    Anti-spoofing and liveness verification service.
    Designed to detect digital screen playback, printed paper photos,
    and extreme motion blur before accepting face recognition.
    """
    
    def __init__(self, blur_threshold: float = 30.0):
        self.blur_threshold = blur_threshold

    def evaluate_liveness(self, bgr_image: np.ndarray, face_box: np.ndarray = None) -> Dict[str, Any]:
        """
        Evaluate frame for passive liveness and anti-spoofing indicators.
        Returns liveness score, pass status, and diagnostic flags.
        """
        if bgr_image is None or bgr_image.size == 0:
            return {"is_live": False, "score": 0.0, "reason": "Empty image"}
            
        gray = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)
        
        # 1. Blur Detection using Laplacian Variance
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        if laplacian_var < self.blur_threshold:
            return {
                "is_live": False,
                "score": float(laplacian_var / 100.0),
                "reason": "Image too blurry for reliable biometric verification"
            }
            
        # 2. Crop Face Region if provided for texture/contrast check
        if face_box is not None and len(face_box) >= 4:
            x, y, w, h = int(face_box[0]), int(face_box[1]), int(face_box[2]), int(face_box[3])
            h_img, w_img = bgr_image.shape[:2]
            x1, y1 = max(0, x), max(0, y)
            x2, y2 = min(w_img, x + w), min(h_img, y + h)
            if x2 > x1 and y2 > y1:
                face_crop = gray[y1:y2, x1:x2]
                face_laplacian = cv2.Laplacian(face_crop, cv2.CV_64F).var()
                if face_laplacian < 15.0:
                    return {
                        "is_live": False,
                        "score": 0.3,
                        "reason": "Low facial texture variation (possible screen reflection or printout)"
                    }

        # 3. Color Gamut check (check RGB channel standard deviation)
        std_devs = [np.std(bgr_image[:, :, i]) for i in range(3)]
        if min(std_devs) < 8.0:
            return {
                "is_live": False,
                "score": 0.4,
                "reason": "Monochromatic or saturated flat lighting detected"
            }
            
        return {
            "is_live": True,
            "score": min(1.0, 0.75 + (laplacian_var / 500.0) * 0.25),
            "reason": "Passed liveness and texture verification"
        }

liveness_service = LivenessDetectionService()
