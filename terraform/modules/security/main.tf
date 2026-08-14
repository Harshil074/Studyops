# Three clean, purpose-specific security groups — each one only allows
# traffic from where it should actually come from. No shared/ambiguous
# groups, no VPC-wide CIDR shortcuts standing in for a real source.

# 1. ALB — the only security group ever open to the internet.
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg"
  description = "Allow inbound HTTP (and, later, HTTPS) from the internet to the ALB"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS is intentionally not opened yet — the first deployment stays on
  # HTTP only (no domain/ACM cert required). To add HTTPS later: uncomment
  # this block, add a `443` listener + ACM cert in the alb module, and
  # redirect the HTTP listener's default action to HTTPS.
  # ingress {
  #   description = "HTTPS from internet"
  #   from_port   = 443
  #   to_port     = 443
  #   protocol    = "tcp"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-alb-sg"
  }
}

# 2. ECS tasks (frontend + backend) — reachable only from the ALB, on
# exactly the two container ports in use. Never open to the internet
# directly, even though tasks have public IPs (see the vpc module's notes
# on why — no NAT Gateway, so tasks need a public IP to reach ECR/the
# internet; inbound is what this security group restricts).
resource "aws_security_group" "ecs" {
  name        = "${var.project_name}-ecs-sg"
  description = "Allow inbound traffic to ECS tasks only from the ALB"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Frontend container port from ALB"
    from_port       = var.frontend_container_port
    to_port         = var.frontend_container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "Backend container port from ALB"
    from_port       = var.backend_container_port
    to_port         = var.backend_container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ecs-sg"
  }
}

# 3. RDS — reachable ONLY from the ECS security group, on 5432. Explicitly
# not a VPC-CIDR-based rule (that would let anything else in the VPC reach
# the database too) — this is a security-group-to-security-group reference,
# so only tasks actually wearing the ECS security group can connect,
# regardless of what subnet they're in.
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow Postgres access only from ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Postgres from ECS tasks only"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
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
