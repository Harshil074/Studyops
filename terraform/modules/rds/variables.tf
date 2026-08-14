variable "project_name" {
  type    = string
  default = "studyops"
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_id" {
  type        = string
  description = "Security group (from the security module) that's allowed to reach this database — RDS creates no security group of its own"
}

variable "db_identifier" {
  type    = string
  default = "studyops-db"
}

variable "db_name" {
  type    = string
  default = "studyops"
}

variable "db_username" {
  type    = string
  default = "studyops"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "engine_version" {
  type    = string
  default = "16"
}

variable "instance_class" {
  type    = string
  default = "db.t3.micro" # AWS Free Tier eligible
}

variable "allocated_storage" {
  type    = number
  default = 20 # AWS Free Tier covers up to 20GB gp2 for RDS
}
