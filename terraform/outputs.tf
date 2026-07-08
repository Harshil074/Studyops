output "rds_endpoint" {
  value = module.rds.endpoint
}

output "rds_db_name" {
  value = module.rds.db_name
}

output "rds_security_group_id" {
  value = module.rds.security_group_id
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}