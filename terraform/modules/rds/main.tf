resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

resource "aws_db_instance" "main" {
  identifier     = var.db_identifier
  engine         = "postgres"
  engine_version = var.engine_version

  instance_class    = var.instance_class
  allocated_storage = var.allocated_storage
  storage_type      = "gp2"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.security_group_id] # owned by the security module — RDS accepts traffic only from the ECS security group

  publicly_accessible = false # never reachable from the internet
  multi_az            = false # single-AZ — keeps cost down; fine for a portfolio project with no uptime SLA
  skip_final_snapshot = true  # so `terraform destroy` doesn't hang waiting for a manual snapshot decision

  tags = {
    Name = var.db_identifier
  }

  # --- prevent_destroy trade-off, made explicit rather than silently
  # choosing one side ---
  # This is deliberately NOT set to `prevent_destroy = true` for this
  # phase of the project. Here's the trade-off, spelled out:
  #   - `prevent_destroy = true` would stop a config mistake (e.g. an
  #     accidental `identifier` change) from silently replacing this
  #     database — a real, valuable safety net for a database holding
  #     real data.
  #   - But `prevent_destroy` is a hard block on `terraform destroy` too —
  #     Terraform refuses to destroy this resource at all while the flag
  #     is set, even intentionally, even via `-target`. Since this project
  #     has no persistent data right now and the whole point of the cost
  #     control section is a fast, reliable `terraform destroy` after every
  #     demo session, adding `prevent_destroy` here would mean editing this
  #     file and re-applying just to allow a routine teardown — friction
  #     that works against the documented cleanup workflow, for a
  #     safety guarantee this phase doesn't need yet.
  # Revisit this once the database holds anything you'd actually mind
  # losing.
}
