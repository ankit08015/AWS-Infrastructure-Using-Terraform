
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

variable "region" {
    type = string
    default = "us-east-1"
}

variable "dynamo_table_name" {
    type = string
    default = "csye6225"
}

variable "vpc" {
  type = string
  default = ""
}

variable "ami" {
  type = string
  default = ""
}

variable "key_name" {
  type = string
  default = ""
}

variable "password" {
  type = string
  default = "AjayGoel"
}

# Application Security Group

resource "aws_security_group" "allow_tls" {
  name        = "application"
  vpc_id = "${data.aws_vpc.selected.id}"
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
    egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// DATABASE SECURITY GROUP
resource "aws_security_group" "allow_tls2" {
  name        = "database"
  vpc_id = "${data.aws_vpc.selected.id}"
  description = "Allow application traffic"
  // ALLOW PORT 5432
  ingress {
    from_port   = 80
    to_port     = 5432
    protocol    = "tcp"
    description = "PORT 5432"
    security_groups = ["${aws_security_group.allow_tls.id}"]
    cidr_blocks = [var.cidr_block_5432]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = var.dynamo_table_name
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "id"
  
  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = true
  }

  tags = {
    Name        = var.dynamo_table_name
    Environment = "development"
  }
}

data "aws_availability_zones" "available" {}

data "aws_vpc" "selected" {
  tags = {
    Name = var.vpc
  }
}



data "aws_subnet_ids" "example" {
  vpc_id = "${data.aws_vpc.selected.id}"
}

data "aws_subnet" "example" {
  count = "${length(data.aws_subnet_ids.example.ids)}"
  id    = "${tolist(data.aws_subnet_ids.example.ids)[count.index]}"
}

resource "aws_db_subnet_group" "main" {
  name       = "main"
   subnet_ids = ["${data.aws_subnet.example[0].id}", "${data.aws_subnet.example[1].id}", "${data.aws_subnet.example[2].id}"]
}

resource "aws_db_instance" "main" {
   identifier = "csye6225-fall2019"
   allocated_storage    = 5
   storage_type         = "gp2"
   engine               = "postgres"
   engine_version       = "11.5"
   instance_class       = "db.t2.medium"
   name                 = "csye6225"
   username             = "dbuser"
   password             = var.password
   multi_az             = false
   publicly_accessible  = true
   db_subnet_group_name = "${aws_db_subnet_group.main.name}"
   vpc_security_group_ids      = ["${aws_security_group.allow_tls2.id}"] 
   skip_final_snapshot = true
}

resource "aws_instance" "instance" {
  ami           =  var.ami
  instance_type = "t2.micro"
  disable_api_termination = false
  vpc_security_group_ids = ["${aws_security_group.allow_tls.id}"]
  subnet_id = "${data.aws_subnet.example[0].id}"
  associate_public_ip_address = true
  key_name = var.key_name
  #  root_block_device {
  #     volume_size           = 20
  #     volume_type           = "gp2"
  # }

  depends_on = [
    aws_db_instance.main
  ]

  ebs_block_device {
      device_name = "/dev/sdf"
      delete_on_termination = true
      volume_size           = 20
      volume_type           = "gp2"
      
  }
  tags = {
    Name = "csye-instance"
  }
}


variable "bucketname" {
  type = string
  default = "webapp.dev.ajaygoel.me"
}


resource "aws_s3_bucket" "bucket" {
  bucket = "${var.bucketname}"
  force_destroy = true
  acl = "private"
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "AES256"
      }
    }
 }
    cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST", "DELETE"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  lifecycle_rule {
    enabled = true

    transition {
      days = 30
      storage_class = "STANDARD_IA"
    }
  }
}

data "aws_iam_user" "selected" {
  user_name = "Administrator"
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = "${aws_s3_bucket.bucket.id}"

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Id": "Policy1488494182833",
    "Statement": [
        {
            "Sid": "Stmt1488493308547",
            "Effect": "Allow",
            "Principal": {
                "AWS": "${data.aws_iam_user.selected.arn}"
            },
            "Action": [
                "s3:ListBucket",
                "s3:ListBucketVersions",
                "s3:GetBucketLocation",
                "s3:Get*",
                "s3:Put*",
                "s3:Delete*"
            ],
            "Resource": "arn:aws:s3:::${var.bucketname}"
        }
    ]
}
POLICY
}