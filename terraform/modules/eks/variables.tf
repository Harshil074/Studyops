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
  default = 2  # was 1 — bumped after hitting pod scheduling limits with ArgoCD on a single node
}

variable "node_min_size" {
  type    = number
  default = 1
}

variable "node_max_size" {
  type    = number
  default = 2
}