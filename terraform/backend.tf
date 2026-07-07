terraform {
  backend "s3" {
    bucket         = "studyops-terraform-state-harshil074"
    key            = "studyops/dev/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "studyops-terraform-locks"
    encrypt        = true
  }
}