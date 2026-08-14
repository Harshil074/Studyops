FROM python:3.11-slim

WORKDIR /app

# Copy dependency definition first for better Docker layer caching
COPY requirements.txt .

# Install application dependencies and upgrade packaging tools
# to versions containing security fixes.
RUN pip install --no-cache-dir --upgrade \
        pip \
        setuptools \
        wheel \
        jaraco.context \
    && pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Run the application as a non-root user
RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]