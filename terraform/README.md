# StudyOps — Clean Terraform Rebuild

This package is the clean, from-scratch Terraform configuration described in the supplied Claude output.

No AWS changes were performed while preparing this package.

## Architecture

VPC -> Security Groups -> RDS / ALB / ECR -> ECS Fargate

- AWS region: ap-south-1
- VPC: 10.1.0.0/16
- Two public subnets
- No NAT Gateway
- Public ALB on HTTP :80
- ECS Fargate frontend on :80
- ECS Fargate backend on :8000
- `/api/*` routes to backend
- Everything else routes to frontend
- Private RDS PostgreSQL
- ECR repositories for frontend and backend
- CloudWatch log groups
- SSM SecureString parameters for DATABASE_URL and SECRET_KEY

## Before first apply

Set the required secrets as environment variables:

    export TF_VAR_db_password='your-password'
    export TF_VAR_jwt_secret_key="$(openssl rand -hex 32)"

Push the bootstrap `latest` image to both ECR repositories before the first ECS deployment.

## Validation sequence

    terraform fmt -recursive
    terraform init
    terraform validate
    terraform plan -out=tfplan

Do NOT apply until the plan has been reviewed.

## Important

This ZIP intentionally does not contain:
- terraform.tfstate
- terraform.tfstate.backup
- terraform.tfvars
- .terraform/
- AWS credentials
- real secrets
