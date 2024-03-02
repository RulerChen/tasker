resource "google_compute_router_nat" "tasker_nat_1" {
  name                               = var.nat_name_1
  router                             = google_compute_router.tasker_router_1.name
  nat_ip_allocate_option             = "MANUAL_ONLY"
  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"

  subnetwork {
    name                    = google_compute_subnetwork.taiwan_subnet_1.id
    source_ip_ranges_to_nat = ["ALL_IP_RANGES"]
  }

  nat_ips = [google_compute_address.tasker_nat_1.self_link]
}

resource "google_compute_address" "tasker_nat_1" {
  name         = var.nat_ip_name_1
  address_type = "EXTERNAL"
  region       = var.region

  depends_on = [google_project_service.compute]
}

