# ArgoCD (legacy — part of the Kubernetes demo stack, not production)

`argocd-application.yaml` is an ArgoCD `Application` resource that watches
`../kubernetes/manifests/overlays/prod` and auto-syncs it onto an EKS
cluster. It's only relevant if you're running the `kubernetes/` demo stack
described in `../kubernetes/README.md`. Production StudyOps (ECS/Fargate)
does not use ArgoCD or GitOps in this repo — it deploys via GitHub
Actions/GitLab CI pushing straight to ECS.
