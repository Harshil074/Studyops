# StudyOps

A student productivity platform (homework tracking, mock tests with
auto-scoring, and a live progress dashboard) — built as a complete,
hands-on DevOps project. The app itself is intentionally simple; the point
of this repository is everything *around* it: containerization,
infrastructure as code, CI/CD, secrets management, and a production
architecture that was manually built on real AWS infrastructure, verified
end-to-end (registration, login, JWT auth, the live dashboard), and then
formalized into Terraform.

This repo also preserves an earlier, independently-valid DevOps
demonstration — the same app deployed to **EKS with ArgoCD GitOps** — as a
clearly separated, optional stack. See [`kubernetes/README.md`](kubernetes/README.md).
**That stack is not what's running in production.**

---

## Architecture (production)

```
                    Developer
                        | git push
        +---------------+----------------+
        |                                |
+-------v---------+              +-------v----------+
| GitHub Actions   |              | GitLab CI (mirror)|
| lint -> build ->  |              | lint -> build ->  |
| scan -> push -> deploy |         | scan -> push -> deploy|
+-------+---------+              +-------+----------+
        | image (SHA-tagged)             |
        v                                v
              Amazon ECR (2 repos: frontend, backend)
                            | pulled by ECS
                            v
                    Internet
                        |
              +---------v----------+
              |  Application Load  |
              |  Balancer (public) |
              +---------+----------+
                         |
            +------------+-------------+
            | /api/*              /*   |
            v                      v
   +-----------------+    +------------------+
   | Backend ECS/     |    | Frontend ECS/    |
   | Fargate service  |    | Fargate service  |
   | (FastAPI, :8000) |    | (React+nginx,:80)|
   +--------+---------+    +------------------+
            | private networking (SG-scoped)
            v
   +----------------------+
   | Amazon RDS PostgreSQL |
   | (private, no public IP)|
   +------------------------+
```

Both ECS services run in **public subnets with public IPs** but are only
reachable **inbound** from the ALB's security group — there's no NAT
Gateway in this project (a deliberate cost decision), so tasks need a
public IP to pull images from ECR and reach the internet, while a security
group (not network isolation) is what actually restricts who can talk to
them.

---

## Tech stack

| Layer | Tools |
|---|---|
| App | FastAPI, SQLAlchemy, PostgreSQL, JWT auth, WebSockets |
| Frontend | React, Vite, Tailwind, nginx (production static serving) |
| Containers | Docker (multi-stage builds, non-root backend user) |
| IaC | Terraform — VPC, RDS, ECR, ALB, ECS/Fargate, IAM, SSM — S3 + DynamoDB remote state |
| Secrets | AWS SSM Parameter Store (SecureString) for `DATABASE_URL` / `SECRET_KEY` |
| CI/CD | GitHub Actions (primary) + GitLab CI (mirror) — build, scan (Trivy), push, deploy to ECS |
| Local dev | Docker Compose (frontend + backend + Postgres) |
| Automation | Python (Boto3 cost report, external health check) |
| Legacy demo | Kubernetes (EKS), ArgoCD, Kustomize, Ansible, Prometheus/Grafana — see `kubernetes/` |

---

## Repository structure

```
StudyOps/
├── backend/                    FastAPI application
├── frontend/                   React + Vite application
├── terraform/                  PRODUCTION infra (ECS/Fargate)
│   ├── modules/
│   │   ├── vpc/                  public subnets, no NAT (cost-optimized)
│   │   ├── rds/                  Postgres, private, VPC-only ingress
│   │   ├── ecr/                  2 repos (frontend + backend), lifecycle policy
│   │   ├── security/             ALB + ECS security groups
│   │   ├── alb/                  ALB, target groups, /api/* routing rule
│   │   └── ecs/                  cluster, task defs, services, IAM, SSM secrets
│   ├── main.tf / variables.tf / outputs.tf / backend.tf / provider.tf
│   └── terraform.tfvars.example
├── kubernetes/                 LEGACY DEMO — EKS + Kustomize + Ansible + monitoring
│   ├── terraform/                 separate state, own eks/ + bastion/ modules
│   ├── manifests/                 Kustomize base + dev/prod overlays
│   ├── ansible/                   bastion SSH hardening + Docker install
│   └── scripts/install-monitoring.sh
├── argocd/                     LEGACY DEMO — ArgoCD Application (watches kubernetes/manifests)
├── scripts/python/             cost_report.py, health_check.py (platform-agnostic)
├── .github/workflows/ci.yml    primary CI/CD -> ECS
├── .gitlab-ci.yml              mirror CI/CD -> ECS
├── docker-compose.yml          local dev: frontend + backend + postgres
├── .env.example
└── docs/legacy/                notes on the EKS->ECS architecture change
```

---

## Local development

```bash
cp .env.example .env
# edit .env: real SECRET_KEY (openssl rand -hex 32) and a POSTGRES_PASSWORD

docker compose up --build
```

- Frontend: `http://localhost:8080`
- Backend directly: `http://localhost:8000` (docs at `/docs`)
- The frontend talks to the backend via relative `/api/...` calls, proxied
  by the frontend container's nginx to the `backend` service on the shared
  Docker network — the same relative-path pattern production uses (there
  the ALB does the routing instead of nginx).
- Running the frontend outside Docker (`npm run dev` inside `frontend/`,
  port 5173) also works: Vite's dev server proxies `/api` to
  `http://localhost:8000` (see `frontend/vite.config.js`), so you can run
  `docker compose up backend postgres` and iterate on the frontend with
  hot reload.

---

## Deploying to AWS (production: ECS/Fargate)

### 1. Prerequisites

- AWS CLI configured with a profile that has sufficient permissions (this
  project uses a profile named `terraform`)
- An S3 bucket + DynamoDB table for Terraform remote state (see
  `terraform/backend.tf` for the exact names this project expects)
- Terraform >= 1.5

### 2. Provision infrastructure

```bash
export AWS_PROFILE=terraform
export TF_VAR_db_password='a-real-password-no-slash-at-quote-or-space'   # RDS rejects / @ " and spaces
export TF_VAR_jwt_secret_key="$(openssl rand -hex 32)"

cd terraform
cp terraform.tfvars.example terraform.tfvars   # edit as needed, no secrets in this file
terraform init
terraform apply
```

This creates: VPC + public subnets, RDS, 2 ECR repos, ALB + target groups +
listener rule, ECS cluster, IAM roles, SSM parameters, and ECS
services/task definitions.

**First apply will fail to reach a healthy state** if the ECR repos are
empty — the initial task definitions reference `${ecr_url}:latest` (see
`bootstrap_image_tag` in `variables.tf`) just so `apply` has something
valid to attempt. Build and push once manually before the first apply, or
right after it and then force a new deployment:

```bash
aws ecr get-login-password --region ap-south-1 --profile terraform | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

docker build -t studyops-backend:latest ./backend
docker tag studyops-backend:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/studyops-backend:latest
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/studyops-backend:latest

docker build -t studyops-frontend:latest ./frontend
docker tag studyops-frontend:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/studyops-frontend:latest
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/studyops-frontend:latest
```

### 3. Point CORS at the real ALB URL

```bash
terraform output alb_dns_name
```

Put that value (as `http://<alb-dns-name>`) into `cors_origins` in
`terraform.tfvars`, then `terraform apply` again — this updates the
`CORS_ORIGINS` SSM parameter the backend reads at startup. Force a new
backend deployment (see step 4's CI/CD path, or `aws ecs update-service
--force-new-deployment`) to pick it up.

### 4. Ongoing deploys (CI/CD, not Terraform)

Every push to `main` on GitHub (or GitLab) runs the pipeline in
`.github/workflows/ci.yml` / `.gitlab-ci.yml`: lint → build both images →
Trivy scan (report-only) → push to ECR with a commit-SHA tag → register a
new ECS task definition revision → `update-service` → wait for stability →
hit `/health` through the ALB.

Terraform's ECS task definitions and services have
`lifecycle.ignore_changes` set specifically so this deploy step never gets
reverted by a later `terraform apply` — **infrastructure and application
deploys are deliberately decoupled** (Terraform owns what exists; CI/CD
owns what's running).

Required repo secrets (GitHub) / CI/CD variables (GitLab):
`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ACCOUNT_ID`.

### 5. Access the app

```bash
terraform output alb_dns_name
```

Open `http://<that-value>` — register, log in, use the app.

---

## Environment variables

See `.env.example` for local dev. In production, `DATABASE_URL` and
`SECRET_KEY` are **not** environment variables set by hand — they're
generated by Terraform (from `TF_VAR_db_password` / `TF_VAR_jwt_secret_key`)
into SSM Parameter Store as `SecureString`s, and injected into the ECS task
via the task definition's `secrets` block. `CORS_ORIGINS`,
`ACCESS_TOKEN_EXPIRE_MINUTES`, etc. are plain (non-secret) task-definition
environment variables.

---

## Security notes

- RDS is `publicly_accessible = false` and only reachable from inside the
  VPC; a security-group rule further scopes that down to "from ECS tasks
  specifically."
- ECS tasks are only reachable from the ALB's security group — not
  directly from the internet, despite having public IPs.
- Secrets (`DATABASE_URL`, `SECRET_KEY`) live in SSM Parameter Store as
  `SecureString`, not as plaintext task-definition environment variables;
  the ECS execution role's IAM policy scopes `ssm:GetParameters` to just
  those two parameter ARNs.
- `.env`, `*.tfstate`, and `*.pem` are gitignored and were verified never
  committed. `.dockerignore` exists for both frontend and backend so
  neither image build context can pick up a local `.env` by accident.
- Trivy scans both images in CI on every push to `main`, currently
  report-only (`exit-code: 0`) — tighten to fail the build once findings
  are triaged (see the comment in the workflow file).

---

## Cost control — stopping/deleting AWS infrastructure

**`terraform destroy`** (with the same `AWS_PROFILE` and both `TF_VAR_*`
values exported) tears down everything the primary stack created. It does
**not** touch the legacy `kubernetes/terraform` stack — destroy that
separately if you applied it (see `kubernetes/README.md`).

Potentially billable resources this project can create — don't assume
stopping ECS alone eliminates charges:

| Resource | Billed even when idle? |
|---|---|
| Application Load Balancer | Yes — hourly, regardless of traffic |
| RDS instance | Yes — hourly, regardless of traffic |
| ECS/Fargate tasks | Only while running — scales to zero if `desired_count = 0` or the service is deleted |
| Public IPv4 addresses (ECS tasks) | Yes, per-IP hourly, while tasks are running |
| ECR storage | Yes, per-GB — the lifecycle policy caps it at 10 images per repo |
| CloudWatch Logs | Minimal — 7-day retention set intentionally |
| Data transfer | Usage-based |

`terraform destroy` removes the ALB and RDS instance (no snapshot —
`skip_final_snapshot = true`, so this is genuinely irreversible), the ECS
services/cluster, and the ECR repos (`force_delete = true`, so it removes
them even with images still in them). Run `aws ecs list-clusters` and `aws
elbv2 describe-load-balancers` afterward to confirm nothing was left
behind — `terraform destroy` can silently skip a resource in some cases
without clearly failing.

---

## Troubleshooting

**ECS service stuck, tasks cycling / `STOPPED`.** Check
`aws ecs describe-tasks` for the `stoppedReason`. Most common causes here:
the SSM parameters weren't created yet (apply order), or the image tag in
the task definition doesn't exist in ECR yet (see the bootstrap-image note
in the deploy steps above).

**ALB target group shows unhealthy.** Backend health check hits `/health`
directly (unauthenticated, checks nothing but process liveness) —
`/health/ready` additionally checks the DB, but isn't what the ALB uses.
If backend targets are unhealthy, check the CloudWatch log group
`/ecs/studyops-backend` first; a `DATABASE_URL` that doesn't resolve is the
most common cause.

**CORS errors in the browser console in production.** `cors_origins` in
`terraform.tfvars` needs to match the real ALB URL exactly (scheme +
host, no trailing slash) — this can't be known until after the first
`apply`, hence the two-step process in the deploy guide above.

**WebSocket (live dashboard) not updating.** The WS route is mounted at
`/api/ws/progress` specifically so it's covered by the ALB's existing
`/api/*` rule — if you've customized the ALB rules, make sure that path
still routes to the backend target group.

---

## What broke, and how it got fixed (real troubleshooting history)

This project was built by actually deploying to real infrastructure
repeatedly, not by writing configuration once and assuming it works. A
few of these are specific to the legacy EKS stack (noted below); the rest
apply just as much to the current ECS architecture.

**A leaked secret, twice.** An inherited `.env` file with a hardcoded JWT
secret was committed to git. Fixed by rotating the key and adding a
proper `.gitignore` — which then got accidentally deleted later, causing
the same file to leak again, this time live on GitHub. Caught by directly
checking the repo file listing rather than trusting `git status` alone,
then fixed by wiping and rebuilding git history.

**A silently broken dependency.** `passlib` (effectively unmaintained)
doesn't understand newer `bcrypt` internals, causing every registration
to fail with a misleading "password too long" error — even for short
passwords. Root-caused by reading the full traceback rather than
guessing, then fixed by dropping `passlib` entirely and calling `bcrypt`
directly.

**RDS's password rules.** AWS RDS rejects `/`, `@`, `"`, and spaces in
master passwords — a constraint not obvious from most tutorials.

**A misconfigured GitLab access token.** A 403 on `git push` turned out to
be caused by a Project Access Token created with the default "Guest"
role, which cannot push regardless of the scopes selected. Fixed by
switching to a Personal Access Token, which inherits the account's actual
(Owner) permissions.

**`terraform destroy` silently leaving a resource behind.** An ECR
repository containing images can't be deleted by Terraform unless
`force_delete = true` is set — and Terraform's destroy summary didn't
surface this as a failure, just quietly skipped it. Caught by directly
querying AWS afterward instead of trusting the "Destroy complete"
message — now a standing habit for every teardown on this project,
including the ECS/ALB/RDS stack.

**A shell variable that silently evaluated to empty.** A `terraform
output` invoked inside a command substitution failed quietly because
`AWS_PROFILE` wasn't exported in that particular terminal, producing a
database URL with no hostname. Fixed by verifying every interpolated
value explicitly before using it in a command — never trust a `$(...)`
substitution blindly.

**A Snap-packaged Docker daemon blocking container stop signals.**
`docker stop`/`docker compose down` failed with "permission denied" even
under `sudo`. Traced via `dmesg | grep apparmor` to AppArmor's
`docker-default` confinement profile (specific to the Snap packaging of
Docker) blocking `term`/`kill` signals between processes. Fixed by
migrating to Docker's official apt-based install.

*(Legacy EKS stack only)* **EKS pod scheduling limits.** Small EC2
instance types have a hard cap on pods per node based on ENI/IP capacity.
Installing ArgoCD, then later a full monitoring stack, exceeded that cap.
Diagnosed via `kubectl describe pod` -> `FailedScheduling: Too many pods`,
fixed by scaling the node group.

*(Legacy EKS stack only)* **Kubernetes Secrets don't survive a cluster
rebuild.** Every session rebuilt EKS from scratch, so a Secret created
manually via `kubectl create secret` didn't exist in the next session —
showed up as `CreateContainerConfigError`, then `CrashLoopBackOff`. This
is part of why the ECS architecture uses SSM Parameter Store instead —
the secret now lives in Terraform state / AWS, not in imperative
`kubectl` commands that don't survive a rebuild.

*(Legacy EKS stack only)* **HPA showing `<unknown>` despite healthy
metrics.** `kubectl top` worked, but HPA couldn't compute a percentage
without `resources.requests.cpu` defined on the container. Fixed by
adding proper `resources.requests`/`limits`.

---

## What's next

- Alembic migrations instead of `create_all()` at startup
- Least-privilege IAM policies instead of broad admin access on the
  `terraform` profile
- HTTPS on the ALB (ACM cert + a real domain) instead of plain HTTP
- Tighten the Trivy scan from report-only to build-failing once findings
  are triaged
