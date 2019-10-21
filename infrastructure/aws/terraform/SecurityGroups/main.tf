
provider "aws" {
    region = var.region
    #profile = "${var.region == "us-east-1" ? "dev" : "prod"}"
}
variable "cidr_block_22" {
  type = string
  default = "0.0.0.0/0"
}

variable "cidr_block_80" {
  type = string
  default = "0.0.0.0/0"
}
variable "cidr_block_443" {
  type = string
  default = "0.0.0.0/0"
}
variable "cidr_block_3000" {
  type = string
  default = "0.0.0.0/0"
}

variable "cidr_block_5432" {
  type = string
  default = "0.0.0.0/0"
}

variable "region"{
    type = string
    default = "us-east-1"
}

resource "aws_security_group" "allow_tls" {
  name        = "application"
  description = "Allow TLS inbound traffic"

  // ALLOW PORT 80
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    description = "PORT 80"
    cidr_blocks = [var.cidr_block_80]
  }

  // ALLOW PORT 443
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    description = "PORT 443"
    cidr_blocks = [var.cidr_block_443]
  }

  // ALLOW PORT 22
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    description = "PORT 22"
    cidr_blocks = [var.cidr_block_22]
  }
  // ALLOW PORT 3000
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    description = "PORT 3000"
    cidr_blocks = [var.cidr_block_3000]
  }
}

// DATABASE SECURITY GROUP
resource "aws_security_group" "allow_tls2" {
  name        = "database"
  description = "Allow application traffic"
  // ALLOW PORT 5432
  ingress {
    from_port   = 80
    to_port     = 5432
    protocol    = "tcp"
    description = "PORT 5432"
    cidr_blocks = [var.cidr_block_5432]
  }
}


resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "csye6225"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "id"
  
  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = false
  }

  tags = {
    Name        = "csye6225"
    Environment = "development"
  }
}