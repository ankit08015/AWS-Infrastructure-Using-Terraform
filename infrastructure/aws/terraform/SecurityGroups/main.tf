
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

variable "aws_access_key_id" {
  type = string
  default = ""
}

variable "aws_secret_access_key" {
  type = string
  default = ""
}

variable "dev_access_key_id" {
  type = string
  default = ""
}

variable "dev_secret_access_key" {
  type = string
  default = ""
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
   publicly_accessible  = false
   db_subnet_group_name = "${aws_db_subnet_group.main.name}"
   vpc_security_group_ids      = ["${aws_security_group.allow_tls2.id}"] 
   skip_final_snapshot = true
}

# variable "endpoint" {
#   type=string
#   value = split(":", "${aws_db_instance.main.endpoint}")[0]
# }

# output "sum" {
#   value = "${var.endpoint}"
# }

resource "aws_instance" "instance" {
  ami           =  var.ami
  instance_type = "t2.micro"
  iam_instance_profile =  "${aws_iam_instance_profile.EC2_instance_profile.name}"
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

  # user_data = "${file(".env")}"
  tags = {
    Name = "csye-instance"
  }

  user_data = <<EOF
#!/bin/bash
sudo systemctl start httpd

#python /home/centos/get-pip.py --user

#/root/.local/bin/pip install awscli --upgrade --user

#yum -y install epel-release

#yum -y install jq

mkdir /home/centos/.aws

sudo touch /home/centos/.aws/config

sudo touch /home/centos/.aws/credentials

sudo touch /home/centos/.env

#echo "[default]" > /home/centos/.aws/config
#echo "region = us-east-1" >> /home/centos/.aws/config
#echo "output_format = json" >> /home/centos/.aws/config

#echo "[default]" > /home/centos/.aws/credentials
#echo "aws_access_key_id =${var.aws_access_key_id}" >> /home/centos/.aws/credentials
#echo "aws_secret_access_key =${var.aws_secret_access_key}" >> /home/centos/.aws/credentials

#echo "/home/centos/.local/bin/aws configure set aws_access_key_id '${var.aws_access_key_id}'" > /home/centos/confAws.sh

#echo "/home/centos/.local/bin/aws configure set aws_secret_access_key '${var.aws_secret_access_key}'" >> /home/centos/confAws.sh

#echo "/home/centos/.local/bin/aws configure set default.region 'us-east-1'" >> /home/centos/confAws.sh

#echo "/home/centos/.local/bin/aws configure set default.output_format 'json'" >> /home/centos/confAws.sh

#echo "DEV_ADMIN_IAM_USER_KEY=${var.dev_access_key_id}" > /home/centos/.env

#echo "DEV_ADMIN_IAM_USER_SECRET=${var.dev_secret_access_key}" >> /home/centos/.env

echo "DATABASE = csye6225" >>  /home/centos/.env

echo "USER_DATA = dbuser" >>  /home/centos/.env

echo "DATABASE_PASSWORD = ${var.password}" >>  /home/centos/.env

echo "BUCKET_NAME = webapp.dev.ankit-yadav.me" >>  /home/centos/.env

#/home/centos/.local/bin/aws rds describe-db-instances --db-instance-identifier csye6225-fall2019 --region us-east-1 --query 'DBInstances[*].[Endpoint.Address]' >> /home/centos/data.json

#endpoint=$(cat /home/centos/data.json  | jq -r '.[][]')

#echo "HOST = $endpoint" >> /home/centos/.env

echo "HOST = ${split(":", "${aws_db_instance.main.endpoint}")[0]}" >> /home/centos/.env

sudo mkdir -p /usr/share/collectd/

sudo touch /usr/share/collectd/types.db


  ###### END OF USER DATA

  EOF
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



variable "codeDeploybucket" {
  type = string
  default = "codedeploy.dev.ajaygoel.me"
}


resource "aws_s3_bucket" "bucket2" {
  bucket = "${var.codeDeploybucket}"
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

# resource "aws_iam_user" "user" {
#   name = "circleci"
# }

data "aws_caller_identity" "current" {}

data "aws_iam_user" "select" {
  user_name = "circleci"
}

resource "aws_iam_policy" "policy" {
  name = "CircleCI-Upload-To-S3"
  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": [
                "${aws_s3_bucket.bucket.arn}"
            ]
        }
    ]
}
POLICY              
}

resource "aws_iam_user_policy_attachment" "upload-to-s3-attach" {
  user       = "${data.aws_iam_user.select.user_name}"
  policy_arn = "${aws_iam_policy.policy.arn}"
}

resource "aws_iam_policy" "policy-code-deploy" {
  name = "CircleCI-Code-Deploy"
  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:RegisterApplicationRevision",
        "codedeploy:GetApplicationRevision"
      ],
      "Resource": [
        "arn:aws:codedeploy:${var.region}:${data.aws_caller_identity.current.account_id}:application:Dummy"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:CreateDeployment",
        "codedeploy:GetDeployment"
      ],
      "Resource": [
        "${aws_s3_bucket.bucket.arn}"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:GetDeploymentConfig"
      ],
      "Resource": [
        "arn:aws:codedeploy:${var.region}:${data.aws_caller_identity.current.account_id}:deploymentconfig:CodeDeployDefault.OneAtATime",
        "arn:aws:codedeploy:${var.region}:${data.aws_caller_identity.current.account_id}:deploymentconfig:CodeDeployDefault.HalfAtATime",
        "arn:aws:codedeploy:${var.region}:${data.aws_caller_identity.current.account_id}:deploymentconfig:CodeDeployDefault.AllAtOnce"
      ]
    }
  ]
}
POLICY              
}

resource "aws_iam_user_policy_attachment" "code-Deploy-attach" {
  user       = "${data.aws_iam_user.select.user_name}"
  policy_arn = "${aws_iam_policy.policy-code-deploy.arn}"
}

resource "aws_iam_policy" "policy-circleci-ec2-ami" {
  name = "circleci-ec2-ami"
  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [{
      "Effect": "Allow",
      "Action" : [
        "ec2:AttachVolume",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:CopyImage",
        "ec2:CreateImage",
        "ec2:CreateKeypair",
        "ec2:CreateSecurityGroup",
        "ec2:CreateSnapshot",
        "ec2:CreateTags",
        "ec2:CreateVolume",
        "ec2:DeleteKeyPair",
        "ec2:DeleteSecurityGroup",
        "ec2:DeleteSnapshot",
        "ec2:DeleteVolume",
        "ec2:DeregisterImage",
        "ec2:DescribeImageAttribute",
        "ec2:DescribeImages",
        "ec2:DescribeInstances",
        "ec2:DescribeInstanceStatus",
        "ec2:DescribeRegions",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSnapshots",
        "ec2:DescribeSubnets",
        "ec2:DescribeTags",
        "ec2:DescribeVolumes",
        "ec2:DetachVolume",
        "ec2:GetPasswordData",
        "ec2:ModifyImageAttribute",
        "ec2:ModifyInstanceAttribute",
        "ec2:ModifySnapshotAttribute",
        "ec2:RegisterImage",
        "ec2:RunInstances",
        "ec2:StopInstances",
        "ec2:TerminateInstances"
      ],
      "Resource": "${aws_s3_bucket.bucket.arn}"
  }]
}
POLICY              
}

resource "aws_iam_user_policy_attachment" "circleci-ec2-ami-attach" {
  user       = "${data.aws_iam_user.select.user_name}"
  policy_arn = "${aws_iam_policy.policy-circleci-ec2-ami.arn}"
}




# Code until line 426 working fine. Trying role now.

resource "aws_iam_role" "Role1" {
  name = "CodeDeployEC2ServiceRole"    

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

  tags = {
      tag-key = "CodeDeployRole"
  }
}


resource "aws_iam_instance_profile" "EC2_instance_profile" {
  name = "EC2_instance_profile"
  role = "${aws_iam_role.Role1.name}"
}


resource "aws_iam_role_policy" "CodeDeploy-EC2-S3" {
  name = "CodeDeploy-EC2-S3"
  role = "${aws_iam_role.Role1.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Effect": "Allow",
            "Resource": [
              "${aws_s3_bucket.bucket2.arn}/*",
              "${aws_s3_bucket.bucket2.arn}",
              "${aws_s3_bucket.bucket.arn}"
              ]
        }
    ]
}
EOF
}

data "aws_iam_policy" "ReadOnlyAccess" {
  arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}
resource "aws_iam_role_policy_attachment" "sto-readonly-role-policy-attach" {
  role       = "${aws_iam_role.Role1.name}"
  policy_arn = "${data.aws_iam_policy.ReadOnlyAccess.arn}"
}

data "aws_iam_policy" "ReadOnlyAccess2" {
  arn = "arn:aws:iam::aws:policy/AmazonRDSFullAccess"
}
resource "aws_iam_role_policy_attachment" "sto-readonly-role-policy-attach2" {
  role       = "${aws_iam_role.Role1.name}"
  policy_arn = "${data.aws_iam_policy.ReadOnlyAccess2.arn}"
}

resource "aws_iam_role_policy" "CloudWatchLogsPolicy" {
  name = "CloudWatchLogsPolicy"
  role = "${aws_iam_role.Role1.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": [
                "arn:aws:logs:*:*:*"
            ]
        }
    ]
}
EOF
}



## CodeDeployServiceRole

resource "aws_iam_role" "Role2" {
  name = "CodeDeployServiceRole"    

assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "codedeploy.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

  resource "aws_iam_role_policy_attachment" "AWSCodeDeployRole" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"
  role       = "${aws_iam_role.Role2.name}"

}

resource "aws_iam_instance_profile" "Deploy_instance_profile" {
  name = "Deploy_instance_profile"
  role = "${aws_iam_role.Role2.name}"
}

resource "aws_codedeploy_app" "csye6225-webapp1" {
  compute_platform = "Server"
  name             = "csye6225-webapp"
}


data "aws_iam_role" "getRole" {
  name = "${aws_iam_role.Role2.name}"
}



resource "aws_codedeploy_deployment_group" "CodeDeploy_Deployment_Group1" {
  app_name              = "${aws_codedeploy_app.csye6225-webapp1.name}"
  deployment_config_name = "CodeDeployDefault.AllAtOnce"
  deployment_group_name = "csye6225-webapp-deployment"
  service_role_arn      = "${data.aws_iam_role.getRole.arn}"


  ec2_tag_set {
    ec2_tag_filter {
      key   = "Name"
      type  = "KEY_AND_VALUE"
      value = "csye-instance"
    }
  }

  auto_rollback_configuration {
    enabled = false
    events  = ["DEPLOYMENT_FAILURE"]
  }

  alarm_configuration {
    alarms  = ["my-alarm-name"]
    enabled = false
  }
}

resource "aws_cloudwatch_log_group" "csye6225_fall2019" {
  name = "csye6225_fall2019"
}

resource "aws_cloudwatch_log_stream" "webapp" {
  name           = "webapp"
  log_group_name = "${aws_cloudwatch_log_group.csye6225_fall2019.name}"
}