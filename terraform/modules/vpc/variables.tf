variable "project_name" {
  type    = string
  default = "studyops"
}

variable "vpc_cidr" {
  type    = string
  default = "10.1.0.0/16"
}

variable "azs" {
  description = "Availability zones to spread the two public subnets across"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

# Order matters: index 0 -> azs[0], index 1 -> azs[1].
variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.1.1.0/24", "10.1.2.0/24"]
}
