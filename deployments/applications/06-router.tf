resource "google_compute_router" "tasker_router_1" {
  name    = var.router_name_1
  network = google_compute_network.tasker_network_1.id
  region  = var.region
}

