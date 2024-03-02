resource "google_compute_firewall" "tasker_firewall_1" {
  name    = var.firewall_name_1
  network = google_compute_network.tasker_network_1.name

  allow {
    protocol = "tcp"
    ports    = ["22", "80", "443", "3389"]
  }

  source_ranges = ["0.0.0.0/0"]
}
