# StudyOps — Backend v2

Student productivity app: homework tracker, mock tests with auto-scoring, and a
progress dashboard that updates live over WebSockets.

## What changed from your original version

- **Mongo → Postgres**, using SQLAlchemy ORM (`models/`) with Pydantic
  schemas kept separate (`schemas/`) — the two were mixed together before.
- **Removed the `.env` that was committed to git**, added `.gitignore`,
  added `.env.example` with placeholders instead. **Rotate `SECRET_KEY`
  immediately** — the old one (`supersecretkey`) is now compromised since
  it was in a file you shared.
- **Removed dead/duplicate code**: `middleware/auth_middleware.py` (an
  unused second copy of `get_current_user` with its *own* hardcoded
  secret) and the duplicate `Settings` class in `config/__init__.py`.
  Auth logic now lives in one place: `auth_utils.py`.
- **Added real features**: homework CRUD, mock test creation/taking/
  scoring, and a progress summary endpoint (completion rate, average
  mock score, daily streak).
- **Added real-time**: a WebSocket endpoint (`/ws/progress`) pushes an
  event the moment a homework task is completed or a mock test is
  submitted, so an open dashboard updates without polling.
- **Added a `/health/ready` probe** that checks DB connectivity — this
  is what Kubernetes readiness probes will hit later, not just "is the
  process alive."
- Non-root user in the Dockerfile, slim base image.

## Running it locally

```bash
cp .env.example .env
# edit .env: set a real SECRET_KEY (openssl rand -hex 32) and a real POSTGRES_PASSWORD

docker compose up --build
```

- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- WebSocket: `ws://localhost:8000/ws/progress?token=<access_token>`

## API quick tour

| Endpoint | Method | Purpose |
|---|---|---|
| `/register`, `/login`, `/refresh`, `/logout` | POST | Auth |
| `/profile` | GET | Current user info |
| `/homework` | GET/POST | List / create tasks |
| `/homework/{id}` | PATCH/DELETE | Update (mark done) / delete |
| `/mock-tests` | GET/POST | List / create a test |
| `/mock-tests/{id}` | GET | Fetch questions (no answers) |
| `/mock-tests/{id}/submit` | POST | Submit answers, get auto-scored |
| `/progress/summary` | GET | Completion rate, avg score, streak |
| `/ws/progress?token=...` | WS | Live push on completion/submission |
| `/health`, `/health/ready` | GET | Liveness / readiness |

## Testing the WebSocket quickly

Open two things at once: a `GET /progress/summary` call, and a WS client
(e.g. `wscat -c "ws://localhost:8000/ws/progress?token=<token>"`). Mark a
homework task complete via `PATCH /homework/{id}` in another terminal —
you should see the event arrive on the WS connection immediately.

## Not built yet (by design, for now)

- React frontend — next phase once this backend is deployed and stable.
- Alembic migrations — currently using `create_all()` at startup, which
  is fine for a portfolio project but not how you'd do schema changes
  in a real production system. Worth mentioning you know this in
  interviews.
- Terraform / Kubernetes / CI-CD / monitoring — that's the next phase
  of the roadmap, layered on top of this app unchanged.

## Note on testing

This was built and syntax-checked (`py_compile`) in an environment
without outbound network access, so dependencies couldn't be installed
to do a full runtime test here. Run `docker compose up --build` on your
machine as the first real test — if anything breaks, paste the error
back and we'll fix it before moving on to infra.
