variable "db_password" {
  type        = string
  sensitive   = true
  description = "RDS master password — supplied via TF_VAR_db_password env var, never committed"
}