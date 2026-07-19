# StudyOps

A student productivity platform (homework tracking, mock tests with
auto-scoring, and a live progress dashboard) — built as a complete,
hands-on DevOps project. The app itself is intentionally simple; the
point of this repository is everything *around* it: infrastructure as
code, containerization, Kubernetes, GitOps, CI/CD, configuration
management, observability, and automation, all built and verified
against real cloud infrastructure rather than left as untested theory.

Every piece described below was applied to real AWS infrastructure,
verified working, and torn down — repeatedly, across many sessions —
not just written and assumed correct.

---

## Architecture

```
                         ┌─────────────────────┐
                         │   GitHub / GitLab     │
                         │  app code + IaC repo  │
                         └──────────┬───────────┘
                                    │ push
                    ┌───────────────┴────────────────┐
                    │                                  │
         ┌──────────▼──────────┐          ┌───────────▼──────────┐
         │  GitHub Actions CI    │          │   GitLab CI (mirror)  │
         │ lint → build → scan  │          │  lint → build → push  │
         │   → push to ECR       │          │      to ECR           │
         └──────────┬────────────┘          └───────────────────────┘
                     │ image
         ┌───────────▼────────────┐
         │      Amazon ECR          │
         └───────────┬────────────┘
                      │ pulled by
         ┌────────────▼─────────────┐
         │        ArgoCD             │  ← watches k8s/overlays/prod
         │   (GitOps auto-sync)      │     in git, auto-deploys on push
         └────────────┬─────────────┘
                       │
   ┌───────────────────▼────────────────────────────────────┐
   │                    AWS EKS Cluster                        │
   │  ┌─────────────┐   ┌──────────────────┐                  │
   │  │  StudyOps    │   │  kube-prometheus-  │                 │
   │  │  Backend     │   │  stack             │                 │
   │  │ (2 replicas, │   │  (Prometheus,      │                 │
   │  │  HPA-scaled) │   │   Grafana,         │                 │
   │  └──────┬───────┘   │   Alertmanager)    │                 │
   │         │           └────────────────────┘                 │
   └─────────┼──────────────────────────────────────────────────┘
             │ private VPC-only connection
   ┌─────────▼─────────┐        ┌─────────────────────┐
   │   Amazon RDS         │        │   Bastion Host (EC2)  │
   │   (Postgres,          │        │   Ansible-hardened:    │
   │   private subnet,     │        │   SSH key-only, Docker │
   │   VPC-only access)    │        │   installed             │
   └───────────────────────┘        └─────────────────────────┘
```

---

## Tech stack

| Layer | Tools |
|---|---|
| App | FastAPI, SQLAlchemy, Postgres, JWT auth, WebSockets |
| Containers | Docker (multi-stage builds, non-root user) |
| IaC | Terraform (VPC, RDS, ECR, EKS, EC2 bastion) — S3 + DynamoDB remote state |
| Orchestration | Kubernetes (EKS), Kustomize (base + dev/prod overlays) |
| GitOps | ArgoCD (automated sync, self-heal, prune) |
| CI/CD | GitHub Actions (primary) + GitLab CI (mirror) |
| Config management | Ansible (bastion SSH hardening, Docker install) |
| Observability | Prometheus, Grafana, Alertmanager (via kube-prometheus-stack), HPA |
| Automation | Python (Boto3 cost reports, health checks), Bash (deploy helpers) |
| Version control | Git, mirrored on GitHub and GitLab |

---

## Repository structure

```
StudyOps/
├── backend/                 # FastAPI application
├── terraform/
│   ├── modules/
│   │   ├── vpc/              # public subnets, no NAT (cost-optimized)
│   │   ├── rds/               # Postgres, private, VPC-only ingress
│   │   ├── ecr/                # image registry, lifecycle policy
│   │   ├── eks/                 # cluster + node group + IAM roles
│   │   └── bastion/              # EC2 + SG restricted to one IP
│   └── main.tf / outputs.tf / backend.tf
├── k8s/
│   ├── base/                  # Deployment, Service, ConfigMap, HPA
│   ├── overlays/dev/           # 1 replica
│   ├── overlays/prod/          # 2 replicas
│   └── argocd-application.yaml
├── ansible/
│   ├── inventory/hosts.ini
│   └── playbooks/bootstrap-bastion.yml
├── scripts/
│   ├── python/cost_report.py     # AWS Cost Explorer summary
│   ├── python/health_check.py    # external synthetic health check, with retries
│   └── bash/install-monitoring.sh
├── .github/workflows/ci.yml
├── .gitlab-ci.yml
└── docker-compose.yml           # local dev
```

---

## Running locally

```bash
cp .env.example .env
# edit .env: real SECRET_KEY (openssl rand -hex 32) and POSTGRES_PASSWORD
docker compose up --build
```
API: `http://localhost:8000` · Docs: `http://localhost:8000/docs`

## Deploying the full stack to AWS

```bash
export AWS_PROFILE=terraform
export TF_VAR_db_password='<a-real-password-no-slash-at-quote-or-space>'

cd terraform
terraform init
terraform apply     # ~15 min — VPC, RDS, EKS, ECR, bastion (22 resources)

aws eks update-kubeconfig --name studyops --region ap-south-1 --profile terraform

# Build & push the app image BEFORE installing anything that depends on it
cd ../backend
aws ecr get-login-password --region ap-south-1 --profile terraform | \
  docker login --username AWS --password-stdin 029458826892.dkr.ecr.ap-south-1.amazonaws.com
docker build -t studyops-backend .
docker tag studyops-backend:latest 029458826892.dkr.ecr.ap-south-1.amazonaws.com/studyops-backend:latest
docker push 029458826892.dkr.ecr.ap-south-1.amazonaws.com/studyops-backend:latest

# ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# metrics-server (needed for HPA)
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl patch deployment metrics-server -n kube-system --type='json' \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'

# App secret (never committed — created imperatively, fresh per cluster)
DB_HOST=$(cd ../terraform && terraform output -raw rds_endpoint | cut -d: -f1)
kubectl create secret generic studyops-secrets \
  --from-literal=DATABASE_URL="postgresql://studyops:${TF_VAR_db_password}@${DB_HOST}:5432/studyops" \
  --from-literal=SECRET_KEY="$(openssl rand -hex 32)"

# Deploy via GitOps
cd ..
kubectl apply -f k8s/argocd-application.yaml

# Monitoring
GRAFANA_ADMIN_PASSWORD='<real-password>' ./scripts/bash/install-monitoring.sh

# Bastion config (SSH hardening + Docker)
cd ansible
ansible-playbook -i inventory/hosts.ini playbooks/bootstrap-bastion.yml
```

**Tear down when done** (this project has no free tier for EKS/RDS —
discipline here matters):
```bash
cd terraform
terraform destroy
```

---

## Deliberate cost/design tradeoffs

Documented here on purpose, not hidden — a real production setup would
differ in these specific ways, and it's worth being explicit about why
these choices were made for a self-funded personal project:

- **No NAT Gateway.** Worker nodes sit in public subnets with tight
  security groups instead. Saves the NAT's hourly cost + data
  processing fees. A real production VPC would use private subnets +
  NAT (or VPC endpoints).
- **No Ingress/LoadBalancer yet.** Verified via `kubectl port-forward`
  instead. A real deployment needs a proper entry point (planned once
  the frontend is built).
- **Single-AZ RDS**, smallest instance sizes, 2–3 node EKS cluster.
  No redundancy needed for a project with no real users.
- **`terraform-admin` IAM user has `AdministratorAccess`**, not
  least-privilege scoped policies. Acceptable for a single-account
  personal project; a real company setup would scope this tightly per
  service/role.
- **Secrets are created imperatively** (`kubectl create secret`, never
  committed to git) rather than via a secrets manager like Vault or
  AWS Secrets Manager — a reasonable next step for a real production
  system.

---

## What broke, and how it got fixed

This project was built by actually deploying to real infrastructure
repeatedly, not by writing configuration once and assuming it works.
Here's what actually went wrong along the way, and how each issue was
diagnosed and resolved — because this is the part that's usually more
informative than a list of finished features.

**A leaked secret, twice.** An inherited `.env` file with a hardcoded
JWT secret was committed to git. Fixed by rotating the key and adding
a proper `.gitignore` — which then got accidentally deleted later,
causing the same file to leak again, this time live on GitHub. Caught
by directly checking the repo file listing rather than trusting
`git status` alone, then fixed by wiping and rebuilding git history.

**A silently broken dependency.** `passlib` (effectively unmaintained)
doesn't understand newer `bcrypt` internals, causing every
registration to fail with a misleading "password too long" error —
even for short passwords. Root-caused by reading the full traceback
rather than guessing, then fixed by dropping `passlib` entirely and
calling `bcrypt` directly.

**RDS's password rules.** AWS RDS rejects `/`, `@`, `"`, and spaces in
master passwords — a constraint not obvious from most tutorials.

**A misconfigured GitLab access token.** A 403 on `git push` turned out
to be caused by a Project Access Token created with the default
"Guest" role, which cannot push regardless of the scopes selected.
Fixed by switching to a Personal Access Token, which inherits the
account's actual (Owner) permissions.

**`terraform destroy` silently leaving a resource behind.** An ECR
repository containing images can't be deleted by Terraform unless
`force_delete = true` is set — and Terraform's destroy summary didn't
surface this as a failure, just quietly skipped it. Caught by directly
querying AWS afterward instead of trusting the "Destroy complete"
message, which is now a standing habit for every teardown.

**EKS pod scheduling limits.** Small EC2 instance types have a hard cap
on pods per node based on ENI/IP capacity, unrelated to CPU or memory.
Installing ArgoCD alongside the app exceeded that cap on a
single-node cluster, and later installing a full monitoring stack
exceeded it again on a two-node cluster. Diagnosed via
`kubectl describe pod` → `FailedScheduling: Too many pods`, fixed by
scaling the node group (and reflecting that change back into the
Terraform config so it doesn't silently drift).

**Kubernetes Secrets don't survive a cluster rebuild.** Since every
session rebuilds EKS from scratch, a Secret created manually via
`kubectl create secret` in one session doesn't exist in the next.
Showed up as `CreateContainerConfigError`, then `CrashLoopBackOff`
with a Postgres connection failure — the classic signature of a
missing environment variable, not a code bug.

**A shell variable that silently evaluated to empty.** A `terraform
output` invoked inside a command substitution failed quietly because
`AWS_PROFILE` wasn't exported in that particular terminal, producing a
database URL with no hostname. The app then tried to connect to a
local Unix socket instead of RDS. Fixed by verifying every
interpolated value explicitly before using it in a command — never
trust a `$(...)` substitution blindly.

**HPA showing `<unknown>` despite healthy metrics.** `kubectl top
nodes` and `kubectl top pods` both returned real data, proving
metrics-server was healthy — but the HPA itself still couldn't compute
a percentage. Root cause: HPA needs `resources.requests.cpu` defined
on the container to have a baseline to calculate against; without it,
raw metrics exist but there's no denominator for a percentage. Fixed
by adding proper `resources.requests`/`limits` to the Deployment —
which is also just correct practice regardless of HPA.

**A stray, forgotten Docker image build.** After destroying and
reapplying infrastructure, a fresh ECR repository is empty — but the
Kubernetes Deployment still references `:latest`. Skipping the
image-push step after a fresh `apply` produces `ImagePullBackOff`.
Fixed by re-ordering the deployment runbook so the image build/push
always happens immediately after infrastructure is up, before
anything that depends on it.

**A Snap-packaged Docker daemon blocking container stop signals.**
`docker stop`/`docker compose down` failed with "permission denied"
even under `sudo`. Traced via `dmesg | grep apparmor` to AppArmor's
`docker-default` confinement profile (specific to the Snap packaging
of Docker) blocking `term`/`kill` signals between processes. Worked
around by restarting the Snap Docker service directly via `systemctl`
rather than fighting the confined stop path; the durable fix is
migrating to Docker's official apt-based install, same lesson learned
earlier with Terraform.

---

## What's next

- React frontend — login, homework tracker, mock test flow, and a
  live dashboard consuming the existing WebSocket endpoint
- Ingress + real entry point once frontend exists
- Alembic migrations instead of `create_all()` at startup
- Least-privilege IAM policies instead of `AdministratorAccess`
- Loki for centralized log aggregation, alongside existing metrics