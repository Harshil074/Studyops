output "repository_urls" {
  value       = { for name, repo in aws_ecr_repository.main : name => repo.repository_url }
  description = "Map of repository name -> repository URL"
}

output "repository_names" {
  value = [for repo in aws_ecr_repository.main : repo.name]
}
