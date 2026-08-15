FROM python:3.11-slim

WORKDIR /app

# Copy dependency definition first for better Docker layer caching
COPY requirements.txt .

# Upgrade packaging tools to versions containing security fixes,
# then install application dependencies.
RUN pip install --no-cache-dir --upgrade \
        pip \
        setuptools \
        wheel \
    && pip install --no-cache-dir -r requirements.txt

# Remove ensurepip's bundled pip/setuptools wheels.
#
# python:3.11-slim ships static, never-executed copies of old pip and
# setuptools wheels under ensurepip/_bundled/, used only to bootstrap pip
# into a *fresh* Python install that has no pip yet. That doesn't apply
# here: pip is already installed and upgraded above. `pip install
# --upgrade` does not touch these bundled files, so they retain their
# original (older) versions and vendored sub-dependencies (e.g. pip
# vendors msgpack internally). Trivy scans them anyway since they're
# just zip files containing package metadata, and reports vulnerabilities
# for code that is never imported or executed. Removing them eliminates
# the false source of these findings instead of ignoring the scan result.
RUN PY_STDLIB="$(python3 -c 'import sysconfig; print(sysconfig.get_paths()["stdlib"])')" \
    && rm -rf "${PY_STDLIB}/ensurepip/_bundled"

# Copy application source
COPY . .

# Run the application as a non-root user
RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]