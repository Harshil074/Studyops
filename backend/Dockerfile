FROM python:3.11-slim

WORKDIR /app

# Install dependencies first so this layer is cached
# unless requirements.txt changes
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir --upgrade \
        "jaraco.context>=6.1.0" \
        "wheel>=0.46.2"

# Copy application code
COPY . .

# Don't run the application as root
RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]