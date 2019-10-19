provider "aws" {
    region = var.region
    #profile = "${var.region == "us-east-1" ? "dev" : "prod"}"
}

#terraform apply -var="region=us-east-2" -var="subnet_cidr_block=10.0.0.0/24
#terraform apply -var="cidr_block=10.0.0.0/16" -var="subnet_cidr_block=10.0.0.0/24"
variable "cidr_block" {
  type = string
  default = "10.0.0.0/16"
}

variable "region"{
    type = string
    default = "us-east-1"
}

variable "vpc_name"{
    type = string
    default = "csye6225"
}

variable "subnet_cidr_block" {
  type = string
  default = "10.0.1.0/24"
}

variable "subnet_cidr_block2" {
  type = string
  default = "10.0.2.0/24"
}

variable "subnet_cidr_block3" {
  type = string
  default = "10.0.3.0/24"
}

resource "aws_vpc" "vpc" {
    cidr_block                          =   var.cidr_block
    tags    =   {
        Name    =   format("%s-%s",var.vpc_name,"vpc")
    }
}

resource "aws_subnet" "subnet" {
    cidr_block                          =   var.subnet_cidr_block
    vpc_id                              =   aws_vpc.vpc.id
    availability_zone                   =   format("%s%s",var.region,"a")
    map_public_ip_on_launch             =   true
    tags        =   {
        Name                            =   format("%s-%s",var.vpc_name,"subnet1")   
    }   
}

resource "aws_subnet" "subnet2" {
    cidr_block                          =   var.subnet_cidr_block2
    vpc_id                              =   aws_vpc.vpc.id
    availability_zone                   =   format("%s%s",var.region,"b")
    map_public_ip_on_launch             =   true
    tags        =   {
        Name                            =   format("%s-%s",var.vpc_name,"subnet2")   
    }   
}

resource "aws_subnet" "subnet3" {
    cidr_block                          =   var.subnet_cidr_block3
    vpc_id                              =   aws_vpc.vpc.id
    availability_zone                   =   format("%s%s",var.region,"c")
    map_public_ip_on_launch             =   true
    tags        =   {
        Name                            =   format("%s-%s",var.vpc_name,"subnet3")   
    }   
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags   = {
    Name = format("%s-%s",var.vpc_name,"IGW")
  }
}

resource "aws_route_table" "rt" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags   = {
    Name = format("%s-%s",var.vpc_name,"RT")
  }
}

resource "aws_route_table_association" "asc1" {
  subnet_id = aws_subnet.subnet.id
  route_table_id = aws_route_table.rt.id
}

resource "aws_route_table_association" "asc2" {
  subnet_id = aws_subnet.subnet2.id
  route_table_id = aws_route_table.rt.id
}
resource "aws_route_table_association" "asc3" {
  subnet_id = aws_subnet.subnet3.id
  route_table_id = aws_route_table.rt.id
}

resource "aws_route" "route" {
    route_table_id = aws_route_table.rt.id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
}
