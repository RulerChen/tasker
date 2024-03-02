resource "google_service_account" "kubernetes" {
  account_id   = "kubernetes"
  display_name = "Kubernetes Service Account"
}

resource "google_container_cluster" "tasker_cluster_1" {
  name                     = var.tasler_cluster_name
  location                 = var.zone
  remove_default_node_pool = true
  initial_node_count       = 1
  min_master_version       = "1.29.0-gke.1381000"
  deletion_protection      = false

  network    = google_compute_network.tasker_network_1.self_link
  subnetwork = google_compute_subnetwork.taiwan_subnet_1.self_link

  logging_service    = "logging.googleapis.com/kubernetes"
  monitoring_service = "monitoring.googleapis.com/kubernetes"
  networking_mode    = "VPC_NATIVE"

  addons_config {
    http_load_balancing {
      disabled = false
    }
    horizontal_pod_autoscaling {
      disabled = true
    }
  }

  release_channel {
    channel = "REGULAR"
  }

  ip_allocation_policy {
    cluster_secondary_range_name  = "taiwan-subnet-1-k8s-pods"
    services_secondary_range_name = "taiwan-subnet-1-k8s-services"
  }

  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }
}

resource "google_container_node_pool" "tasker_node_pool_1" {
  name       = "tasker-node-pool-1"
  location   = var.zone
  cluster    = google_container_cluster.tasker_cluster_1.id
  node_count = 1

  node_config {
    machine_type    = "e2-medium"
    preemptible     = false
    disk_size_gb    = 100
    disk_type       = "pd-standard"
    image_type      = "COS_CONTAINERD"
    service_account = google_service_account.kubernetes.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
    labels = {
      name = "tasker-node-pool-1"
    }
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }
}
