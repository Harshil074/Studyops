variable "project_name" {
  type    = string
  default = "studyops"
}

variable "vpc_id" {
  type = string
}

variable "backend_container_port" {
  type    = number
  default = 8000
}

variable "frontend_container_port" {
  type    = number
  default = 80
}
