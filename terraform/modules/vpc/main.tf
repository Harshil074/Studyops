resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Public subnets only — no NAT Gateway. This is a deliberate cost trade-off
# for this phase: a NAT Gateway bills hourly plus data processing charges
# whether or not it's used, which doesn't make sense for a portfolio
# project that's torn down between demos. Instead, ECS tasks get public IPs
# directly (see the ecs module's `assign_public_ip = true`) so they can
# pull images from ECR and reach the internet without one. Inbound access
# is still locked down by security groups (see the security module) — the
# tasks are reachable from the ALB only, not from the internet directly,
# despite having public IPs. Revisit this if/when private subnets + NAT (or
# VPC endpoints for ECR/S3/CloudWatch, which avoid NAT's per-GB data
# charges) become worth the added cost.
resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.azs[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-${count.index}"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
