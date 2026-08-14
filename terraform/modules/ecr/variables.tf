variable "repository_names" {
  type        = list(string)
  default     = ["studyops-backend", "studyops-frontend"]
  description = "ECR repositories to create — one per deployable image"
}
