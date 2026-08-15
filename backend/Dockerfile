# ---- Build stage: install dependencies into an isolated venv ----
FROM python:3.11-slim AS builder

WORKDIR /app

COPY requirements.txt .

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

# ---- Runtime stage: only what's needed to run the app ----
FROM python:3.11-slim

WORKDIR /app

# Copy the venv (app dependencies + console scripts like `uvicorn`)
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy application source
COPY . .

# Remove pip, setuptools, and wheel from the runtime image (both the
# global copy the base image ships, and the copy inside the venv).
#
# These are build-time-only tools. Verified directly: every dependency
# in requirements.txt -- including uvicorn's own console script --
# imports and runs with pip/setuptools/wheel completely absent.
#
# This is also the actual fix for the Trivy findings on this image.
# pip vendors an internal (currently outdated) copy of msgpack for its
# own HTTP response caching -- see pip/_vendor/vendor.txt inside any
# current pip release -- and Trivy separately flags a
# `setuptools==70.3.0` line in that same manifest even though pip does
# not actually bundle setuptools's code (verified: no
# pip/_vendor/setuptools/ directory exists in the installed package).
# Neither is reachable from application code once pip itself is gone,
# so removing pip/setuptools/wheel from the runtime image removes both
# the real finding (msgpack) and the manifest-only false positive
# (setuptools) at the source -- rather than chasing a version pin that
# will just drift again on the next `pip install --upgrade`.
RUN set -eux; \
    find /usr/local/lib/python3.11/site-packages /opt/venv/lib/python3.11/site-packages \
        -maxdepth 1 \( \
            -iname 'pip' -o -iname 'pip-*.dist-info' \
            -o -iname 'setuptools' -o -iname 'setuptools-*.dist-info' \
            -o -iname 'wheel' -o -iname 'wheel-*.dist-info' \
        \) -exec rm -rf {} + ; \
    rm -rf /usr/local/lib/python3.11/ensurepip /opt/venv/bin/pip* /usr/local/bin/pip*; \
    /opt/venv/bin/python -c "\
import fastapi, uvicorn, sqlalchemy, psycopg2, jose, bcrypt, pydantic, dotenv, websockets; \
print('>>> Runtime image verified importable without pip/setuptools/wheel.')"

# Run the application as a non-root user
RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]