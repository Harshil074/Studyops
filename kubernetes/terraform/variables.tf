variable "bastion_key_name" {
  type        = string
  default     = "studyops-bastion-key"
  description = "Name of the existing EC2 key pair to attach to the bastion — must already exist in the AWS account"
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "Your current public IP in CIDR form (e.g. 203.0.113.4/32) — NEVER default this to 0.0.0.0/0. Changes whenever your home/office IP changes; check with `curl ifconfig.me`."
}
