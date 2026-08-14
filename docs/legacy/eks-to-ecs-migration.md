# Why the production architecture moved from EKS to ECS/Fargate

Earlier sessions of this project built out a full EKS + Kustomize + ArgoCD
GitOps deployment, documented in the original README and still preserved
under `kubernetes/` and `argocd/` at the repo root as a separate DevOps
demonstration.

The application was later deployed manually to **ECS/Fargate behind an
ALB** instead, and that deployment was verified end-to-end (registration,
login, JWT auth, the live WebSocket dashboard, backend/frontend both
healthy behind the ALB). Because that's the architecture that was actually
proven working, it became the primary, documented production path — and
the repository was reorganized so:

- `/terraform` at the repo root now provisions **only** the ECS/Fargate
  architecture (VPC, RDS, ECR ×2, ALB, ECS, IAM, SSM secrets).
- The EKS/bastion Terraform modules moved to `kubernetes/terraform/` as a
  **second, separate Terraform root** with its own remote-state key, so
  applying/destroying one stack never touches the other.
- The Kustomize manifests, ArgoCD Application, Ansible playbook, and
  monitoring install script all moved under `kubernetes/` (Kustomize +
  Ansible + monitoring) and `argocd/` (the ArgoCD Application), unchanged
  in content — nothing about the Kubernetes work was deleted, only
  relocated and clearly labeled.

Nothing here implies the EKS/ArgoCD work was wrong or wasted — it's a
legitimate, separately-valid demonstration of Kubernetes, Kustomize,
GitOps, and Ansible. It just isn't what StudyOps runs on today, and the
repo now says so explicitly instead of documenting an architecture that
was no longer what was actually deployed.
