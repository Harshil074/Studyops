# OPTIONAL / LEGACY DEMO STACK — not part of the production architecture.
#
# The production app runs on ECS/Fargate (see /terraform at the repo root).
# This stack exists purely as a separate DevOps demonstration of an
# EKS + GitOps (ArgoCD) + Kustomize deployment path, and is NOT wired into
# the primary Terraform state or applied as part of a normal deployment.
#
# It reuses the primary stack's VPC (via remote state) instead of
# provisioning a second VPC, so you must `terraform apply` the root
# /terraform stack at least once before applying this one.

data "terraform_remote_state" "core" {
  backend = "s3"

  config = {
    bucket = "studyops-terraform-state-harshil074"
    key    = "studyops/dev/terraform.tfstate" # same state as /terraform
    region = "ap-south-1"
  }
}

module "eks" {
  source = "./eks"

  vpc_id     = data.terraform_remote_state.core.outputs.vpc_id
  subnet_ids = data.terraform_remote_state.core.outputs.public_subnet_ids
}

module "bastion" {
  source = "./bastion"

  vpc_id           = data.terraform_remote_state.core.outputs.vpc_id
  subnet_id        = data.terraform_remote_state.core.outputs.public_subnet_ids[0]
  key_name         = var.bastion_key_name
  allowed_ssh_cidr = var.allowed_ssh_cidr
}
