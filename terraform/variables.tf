variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "backend_container_port" {
  type    = number
  default = 8000
}

variable "frontend_container_port" {
  type    = number
  default = 80
}

# --- Database ---------------------------------------------------------
variable "db_username" {
  type    = string
  default = "studyops"
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "RDS master password — supplied via TF_VAR_db_password env var, never committed. AWS RDS rejects '/', '@', '\"', and spaces."
}

# --- ECS ----------------------------------------------------------------
variable "ecs_desired_count" {
  type        = number
  default     = 1
  description = "Number of running tasks per ECS service today. Kept at 1 to minimize Fargate cost for a portfolio project."
}

# Reserved for the next phase (ECS Service Auto Scaling) — not wired to an
# aws_appautoscaling_target/policy yet, deliberately: this task is scoped
# to the base infrastructure only. Declaring these now means the autoscaling
# work later is additive (new resources referencing these variables) rather
# than a breaking change to this file.
variable "ecs_min_capacity" {
  type        = number
  default     = 1
  description = "Reserved for future ECS Service Auto Scaling — not yet wired to any resource."
}

variable "ecs_max_capacity" {
  type        = number
  default     = 3
  description = "Reserved for future ECS Service Auto Scaling — not yet wired to any resource."
}

variable "bootstrap_image_tag" {
  type        = string
  default     = "latest"
  description = "Image tag used ONLY for the first `terraform apply`, before any image has been pushed via CI/CD. Push :latest to both ECR repos before the first apply, or apply will fail to pull an image. CI/CD manages the running image after that (task definitions have lifecycle.ignore_changes)."
}

variable "log_retention_days" {
  type        = number
  default     = 7
  description = "CloudWatch Logs retention for both ECS services — kept short by default to minimize cost."
}

# --- Backend application config ------------------------------------------
variable "jwt_secret_key" {
  type        = string
  sensitive   = true
  description = "JWT signing secret — supplied via TF_VAR_jwt_secret_key env var, never committed. Generate with: openssl rand -hex 32"
}

variable "cors_origins" {
  type        = string
  default     = "https://REPLACE_WITH_YOUR_ALB_DNS_NAME"
  description = "Comma-separated allowed CORS origins for the backend in production. Update after the first apply once you know the ALB DNS name (see the alb_dns_name output), then re-apply."
}

# --- HTTPS — reserved for a future phase ---------------------------------
# Not used by any resource yet. Once you have a domain + ACM certificate,
# set acm_certificate_arn and wire it into the alb module's (not-yet-built)
# HTTPS listener — see the commented-out sections in modules/alb/main.tf
# and modules/security/main.tf for exactly where.
variable "acm_certificate_arn" {
  type        = string
  default     = ""
  description = "Reserved for future HTTPS support — not yet wired to any resource."
}
