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