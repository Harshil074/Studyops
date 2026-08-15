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
#
# Uses `find` (not a single guessed path) so this can't silently no-op,
# and prints what it found/deleted directly into the build log as proof.
RUN set -eux; \
    echo ">>> Locating ensurepip bundled wheels before cleanup:"; \
    find / -xdev -type d -path '*/ensurepip/_bundled' -print 2>/dev/null; \
    find / -xdev -type d -path '*/ensurepip/_bundled' -print0 2>/dev/null \
        | xargs -0 -r -I{} sh -c 'echo "  removing: {}"; rm -rf "{}"'; \
    echo ">>> Verifying no ensurepip bundled wheels remain:"; \
    remaining="$(find / -xdev -type d -path '*/ensurepip/_bundled' 2>/dev/null)"; \
    if [ -n "$remaining" ]; then \
        echo "ERROR: ensurepip bundled wheels still present: $remaining" >&2; \
        exit 1; \
    fi; \
    echo ">>> Clean."

# Copy application source
COPY . .

# Run the application as a non-root user
RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]