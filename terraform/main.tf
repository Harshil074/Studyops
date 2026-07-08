module "vpc" {
  source = "./modules/vpc"
}

module "rds" {
  source = "./modules/rds"

  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.public_subnet_ids
  db_password = var.db_password
}