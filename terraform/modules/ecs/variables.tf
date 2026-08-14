variable "project_name" {
  type    = string
  default = "studyops"
}

variable "aws_region" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "ecs_security_group_id" {
  type = string
}

variable "frontend_target_group_arn" {
  type = string
}

variable "backend_target_group_arn" {
  type = string
}

variable "frontend_image" {
  type        = string
  description = "Full ECR image URI:tag for the frontend task's bootstrap deployment. CI/CD manages the running image after that (see lifecycle.ignore_changes)."
}

variable "backend_image" {
  type        = string
  description = "Full ECR image URI:tag for the backend task's bootstrap deployment. CI/CD manages the running image after that (see lifecycle.ignore_changes)."
}

variable "backend_container_port" {
  type    = number
  default = 8000
}

variable "frontend_container_port" {
  type    = number
  default = 80
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "log_retention_days" {
  type        = number
  default     = 7
  description = "CloudWatch Logs retention for both services' log groups — kept short by default to minimize cost for a portfolio project"
}

variable "backend_cpu" {
  type    = number
  default = 256
}

variable "backend_memory" {
  type    = number
  default = 512
}

variable "frontend_cpu" {
  type    = number
  default = 256
}

variable "frontend_memory" {
  type    = number
  default = 512
}

# --- backend application configuration / secrets ---------------------------
variable "database_url" {
  type        = string
  sensitive   = true
  description = "Full postgres:// connection string for the backend, stored in SSM Parameter Store"
}

variable "jwt_secret_key" {
  type        = string
  sensitive   = true
  description = "JWT signing secret, stored in SSM Parameter Store"
}

variable "jwt_algorithm" {
  type    = string
  default = "HS256"
}

variable "access_token_expire_minutes" {
  type    = number
  default = 60
}

variable "refresh_token_expire_days" {
  type    = number
  default = 7
}

variable "cors_origins" {
  type        = string
  description = "Comma-separated list of allowed CORS origins for the backend"
}
