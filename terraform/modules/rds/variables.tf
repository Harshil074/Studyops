variable "project_name" {
  type    = string
  default = "studyops"
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
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

variable "instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "allocated_storage" {
  type    = number
  default = 20
}