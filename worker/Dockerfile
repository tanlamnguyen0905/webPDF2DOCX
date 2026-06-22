# syntax=docker/dockerfile:1
FROM python:3.11-slim

# LibreOffice/poppler có thể cần cho OCR/convert nâng cao — bật khi dùng:
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     poppler-utils tesseract-ocr && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app

CMD ["python", "-m", "app.main"]
