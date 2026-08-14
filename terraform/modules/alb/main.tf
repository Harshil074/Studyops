resource "aws_lb" "main" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  tags = {
    Name = "${var.project_name}-alb"
  }
}

# target_type = "ip" is required for Fargate tasks (awsvpc networking) —
# EC2-backed ECS would use "instance" instead.
resource "aws_lb_target_group" "frontend" {
  name        = "${var.project_name}-frontend-tg"
  port        = var.frontend_container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
    timeout             = 5
    matcher             = "200"
  }

  tags = {
    Name = "${var.project_name}-frontend-tg"
  }
}

resource "aws_lb_target_group" "backend" {
  name        = "${var.project_name}-backend-tg"
  port        = var.backend_container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  # Hits FastAPI's liveness endpoint directly — not behind auth, matches
  # what backend/routers/health.py exposes.
  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
    timeout             = 5
    matcher             = "200"
  }

  tags = {
    Name = "${var.project_name}-backend-tg"
  }
}

# HTTP only for this phase — no domain/ACM certificate required. To add
# HTTPS later: create an ACM certificate, add a second `aws_lb_listener`
# on 443 referencing it (with this same default_action), change this
# listener's default_action to a redirect to HTTPS instead of forwarding,
# and open port 443 on the ALB security group (see the security module's
# commented-out block for this).
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  # Default: everything that isn't /api/* goes to the frontend.
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# Reproduces the required routing: /api/* -> backend, everything else ->
# frontend (via the listener's default action above). The backend's
# WebSocket route is mounted at /api/ws/progress specifically so it's
# covered by this same rule — no separate WebSocket routing needed.
resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}
