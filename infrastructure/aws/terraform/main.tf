provider "aws" {
    region = var.region
}

#terraform apply -var="cidr_block=10.0.0.0/16" -var="subnet_cidr_block=10.0.0.0/24"
variable "cidr_block" {
  type = string
  default = "10.0.0.0/16"
}

variable "region"{
    type = string
}

variable "subnet_cidr_block" {
  type = string
  default = "10.0.1.0/24"
}

resource "aws_vpc" "vpc" {
    cidr_block                          =   var.cidr_block
    enable_dns_hostnames                =   true
    enable_dns_support                  =   true
    enable_classiclink_dns_support      =   true
    assign_generated_ipv6_cidr_block    =   false
    tags    =   {
        Name    =   "csye6225-vpc"
    }
}

resource "aws_subnet" "subnet" {
    cidr_block                          =   var.cidr_block
    vpc_id              = aws_vpc.vpc.id
    availability_zone   = "us-east-1a"
    map_public_ip_on_launch     = true
    tags    =   {
        Name = "csye6225-subnet"   
    }   
}