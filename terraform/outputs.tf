output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "alb_dns_name" {
  description = "Open this in a browser to reach the app once ECS services are healthy — this is also the URL to put in cors_origins"
  value       = module.alb.alb_dns_name
}

output "frontend_repository_url" {
  value = module.ecr.repository_urls["studyops-frontend"]
}

output "backend_repository_url" {
  value = module.ecr.repository_urls["studyops-backend"]
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "frontend_service_name" {
  value = module.ecs.frontend_service_name
}

output "backend_service_name" {
  value = module.ecs.backend_service_name
}

output "rds_endpoint" {
  value = module.rds.endpoint
}

output "rds_db_name" {
  value = module.rds.db_name
}
