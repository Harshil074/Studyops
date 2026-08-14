# Kubernetes / GitOps demo stack (legacy — not the production architecture)

This directory holds a **separate, self-contained DevOps demonstration**:
StudyOps deployed to **AWS EKS** via Kustomize + **ArgoCD** GitOps, with
Ansible-hardened bastion access and a `kube-prometheus-stack` monitoring
setup — built and torn down against real AWS infrastructure across earlier
sessions of this project.

**It is not what's currently running in production.** The production
deployment is **ECS/Fargate**, defined in `/terraform` at the repo root —
see the root `README.md` for that architecture. This folder is kept because
the EKS/ArgoCD/Ansible work is a legitimate, independently-valid DevOps
demonstration in its own right (Kubernetes, Kustomize, GitOps, Helm,
Prometheus/Grafana, Ansible), even though it's not the path StudyOps
actually ships on today.

## What's here

| Path | What it is |
|---|---|
| `terraform/` | A **second, separate Terraform root** (own S3 state key) provisioning an EKS cluster + a bastion EC2 host. It reads the production stack's VPC via `terraform_remote_state` rather than creating its own VPC. |
| `manifests/` | Kustomize manifests (`base/` + `overlays/dev,prod`) for deploying the backend to EKS — Deployment, Service, ConfigMap, HPA. |
| `ansible/` | Playbook + inventory for hardening the bastion host (SSH key-only, Docker install). |
| `scripts/install-monitoring.sh` | Installs `kube-prometheus-stack` (Prometheus, Grafana, Alertmanager) via Helm onto the EKS cluster. |
| `monitoring/` | Placeholder for any exported Grafana dashboards / Prometheus rules (currently empty). |

See `../argocd/` for the ArgoCD Application manifest that watches
`manifests/overlays/prod`.

## Using this stack

1. Apply the production `/terraform` stack first — this stack depends on
   its VPC/subnet outputs.
2. `cd kubernetes/terraform && terraform init && terraform apply` (needs its
   own `allowed_ssh_cidr` — see `variables.tf`).
3. Point `kubectl` at the new EKS cluster, then either apply the Kustomize
   overlay directly (`kubectl apply -k manifests/overlays/prod`) or install
   ArgoCD and apply `../argocd/argocd-application.yaml` to let it sync
   automatically from git.
4. `bash scripts/install-monitoring.sh` to add Prometheus/Grafana.

## Cost note

An EKS cluster + worker nodes + a bastion EC2 instance are all separately
billable, **on top of** whatever the production ECS stack costs. Don't
apply this unless you specifically want to demo it — see the root
`README.md`'s cost-control section, which covers both stacks.
