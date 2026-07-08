resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# Only allow Postgres traffic (5432) from inside the VPC itself —
# never expose the database directly to the internet.
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow Postgres access from within the VPC only"
  vpc_id      = var.vpc_id

  ingress {
    description = "Postgres from within VPC"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-db"
  engine         = "postgres"
  engine_version = "16"

  instance_class    = var.instance_class
  allocated_storage = var.allocated_storage
  storage_type      = "gp2"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  publicly_accessible = false  # only reachable from inside the VPC (e.g. EKS pods later)
  multi_az            = false  # single-AZ — keeps cost down, fine for a portfolio project
  skip_final_snapshot = true   # so `terraform destroy` doesn't hang waiting for a snapshot

  tags = {
    Name = "${var.project_name}-db"
  }
}