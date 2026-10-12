FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for OpenCV & build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Download OpenCV YuNet and SFace weights if not present
RUN mkdir -p app/models_weights && \
    if [ ! -f app/models_weights/face_detection_yunet_2023mar.onnx ]; then \
        curl -L -o app/models_weights/face_detection_yunet_2023mar.onnx "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"; \
    fi && \
    if [ ! -f app/models_weights/face_recognition_sface_2021dec.onnx ]; then \
        curl -L -o app/models_weights/face_recognition_sface_2021dec.onnx "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"; \
    fi

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
