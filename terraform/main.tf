# --- Networking -------------------------------------------------------
module "vpc" {
  source = "./modules/vpc"
}

# --- Security groups (all three live together — see modules/security) ----
module "security" {
  source = "./modules/security"

  vpc_id                  = module.vpc.vpc_id
  backend_container_port  = var.backend_container_port
  frontend_container_port = var.frontend_container_port
}

# --- Database -----------------------------------------------------------
# Depends on security (for its security group), not the other way around —
# RDS creates no security group of its own, it only accepts traffic from
# the ECS security group the security module already created.
module "rds" {
  source = "./modules/rds"

  subnet_ids        = module.vpc.public_subnet_ids
  security_group_id = module.security.rds_security_group_id
  db_username       = var.db_username
  db_password       = var.db_password
}

# --- Image registries -----------------------------------------------------
module "ecr" {
  source = "./modules/ecr"
}

# --- Load balancer --------------------------------------------------------
module "alb" {
  source = "./modules/alb"

  vpc_id                  = module.vpc.vpc_id
  public_subnet_ids       = module.vpc.public_subnet_ids
  alb_security_group_id   = module.security.alb_security_group_id
  frontend_container_port = var.frontend_container_port
  backend_container_port  = var.backend_container_port
}

# --- Compute (ECS/Fargate) -------------------------------------------------
module "ecs" {
  source = "./modules/ecs"

  aws_region            = var.aws_region
  public_subnet_ids     = module.vpc.public_subnet_ids
  ecs_security_group_id = module.security.ecs_security_group_id

  frontend_target_group_arn = module.alb.frontend_target_group_arn
  backend_target_group_arn  = module.alb.backend_target_group_arn

  frontend_image = "${module.ecr.repository_urls["studyops-frontend"]}:${var.bootstrap_image_tag}"
  backend_image  = "${module.ecr.repository_urls["studyops-backend"]}:${var.bootstrap_image_tag}"

  backend_container_port  = var.backend_container_port
  frontend_container_port = var.frontend_container_port
  desired_count           = var.ecs_desired_count
  log_retention_days      = var.log_retention_days

  database_url   = "postgresql://${var.db_username}:${var.db_password}@${module.rds.endpoint}/${module.rds.db_name}"
  jwt_secret_key = var.jwt_secret_key
  cors_origins   = var.cors_origins
}
