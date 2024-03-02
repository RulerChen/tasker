terraform {
  backend "gcs" {
    bucket = "tasker-gcp-tfstate-bucket"
    prefix = "terraform/state"
  }
}

locals {
  cluster_name = "tasker-cluster"
}
