variable "project_id" {
  description = "The project ID to deploy into"
  type        = string
  default     = "tasker-gcp"
}

variable "region" {
  description = "The region to deploy into"
  type        = string
  default     = "asia-east1"
}

variable "zone" {
  description = "The zone to deploy into"
  type        = string
  default     = "asia-east1-a"
}

variable "cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
  default     = "tasker-gcp-cluster"
}

variable "network_name_1" {
  description = "The name of the VPC network"
  type        = string
  default     = "tasker-gcp-network-1"
}

variable "subnet_name_1" {
  description = "The name of the subnet"
  type        = string
  default     = "taiwan-gcp-subnet-1"

}

variable "router_name_1" {
  description = "The name of the router"
  type        = string
  default     = "tasker-gcp-router-1"
}

variable "nat_name_1" {
  description = "The name of the NAT"
  type        = string
  default     = "tasker-gcp-nat-1"
}

variable "nat_ip_name_1" {
  description = "The name of the NAT IP"
  type        = string
  default     = "tasker-gcp-nat-ip-1"

}

variable "firewall_name_1" {
  description = "The name of the firewall"
  type        = string
  default     = "tasker-gcp-firewall-1"

}

variable "tasler_cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
  default     = "tasker-gcp-cluster"

}
