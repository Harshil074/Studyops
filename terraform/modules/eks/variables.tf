variable "cluster_name" {
  type    = string
  default = "studyops"
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "node_instance_type" {
  type    = string
  default = "t3.small"  # smallest reasonable size for EKS worker nodes
}

variable "node_desired_size" {
  type    = number
  default = 3  # bumped again after monitoring stack hit "Too many pods" on 2 nodes
}

variable "node_min_size" {
  type    = number
  default = 1
}

variable "node_max_size" {
  type    = number
  default = 3
}