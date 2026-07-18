variable "project_name" {
  type    = string
  default = "studyops"
}

variable "vpc_id" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "key_name" {
  description = "Name of an existing EC2 key pair for SSH access"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "Your IP, in CIDR form (e.g. 1.2.3.4/32) — never leave this as 0.0.0.0/0"
  type        = string
}
