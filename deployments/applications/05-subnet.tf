resource "google_compute_subnetwork" "taiwan_subnet_1" {
  name                     = var.subnet_name_1
  network                  = google_compute_network.tasker_network_1.id
  ip_cidr_range            = "10.0.0.0/16"
  region                   = var.region
  private_ip_google_access = true

  secondary_ip_range {
    range_name    = "taiwan-subnet-1-k8s-pods"
    ip_cidr_range = "10.14.0.0/20"
  }
  secondary_ip_range {
    range_name    = "taiwan-subnet-1-k8s-services"
    ip_cidr_range = "10.18.0.0/20"
  }
}
