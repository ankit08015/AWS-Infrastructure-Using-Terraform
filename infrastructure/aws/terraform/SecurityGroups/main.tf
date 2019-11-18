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

variable "bucketname" {
  type = string
  default = ""
}

variable "zone-id" {
  type = string
  default = ""
}

variable "cert-arn" {
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

  #   // ALLOW PORT 80
  # ingress {
  #   from_port   = 80
  #   to_port     = 80
  #   protocol    = "tcp"
  #   description = "PORT 80"
  #   cidr_blocks = [var.cidr_block_80]
  # }

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
  range_key      = "token"  
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "token"
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

//////////////////////////////ASSIGNMENT8 LAMBDA POLICIES
// CREATING ROles and policies for lambda

resource "aws_iam_role" "iam_for_lambda" {
  name = "lambdaServiceRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

data "aws_iam_policy" "lambdaexecutionPolicy" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_role_policy_attachment" "sto-readonly-role-policy-attach3" {
  role       = "${aws_iam_role.iam_for_lambda.name}"
  policy_arn = "${data.aws_iam_policy.lambdaexecutionPolicy.arn}"
}

data "aws_iam_policy" "AWSXrayWriteOnlyAccess" {
  arn = "arn:aws:iam::aws:policy/AWSXrayWriteOnlyAccess"
}
resource "aws_iam_role_policy_attachment" "sto-readonly-role-policy-attach4" {
  role       = "${aws_iam_role.iam_for_lambda.name}"
  policy_arn = "${data.aws_iam_policy.AWSXrayWriteOnlyAccess.arn}"
}

data "aws_iam_policy" "AWSLambdaDynamoDBExecutionRole" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaDynamoDBExecutionRole"
}
resource "aws_iam_role_policy_attachment" "sto-readonly-role-policy-attach5" {
  role       = "${aws_iam_role.iam_for_lambda.name}"
  policy_arn = "${data.aws_iam_policy.AWSLambdaDynamoDBExecutionRole.arn}"
}
data "aws_iam_policy" "AWSLambdaSQSQueueExecutionRole" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}
resource "aws_iam_role_policy_attachment" "sto-readonly-role-policy-attach6" {
  role       = "${aws_iam_role.iam_for_lambda.name}"
  policy_arn = "${data.aws_iam_policy.AWSLambdaSQSQueueExecutionRole.arn}"
}
data "aws_iam_policy" "AWSLambdaVPCAccessExecutionRole" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
resource "aws_iam_role_policy_attachment" "sto-readonly-role-policy-attach7" {
  role       = "${aws_iam_role.iam_for_lambda.name}"
  policy_arn = "${data.aws_iam_policy.AWSLambdaVPCAccessExecutionRole.arn}"
}

data "aws_iam_policy" "AmazonSESFullAccess" {
  arn = "arn:aws:iam::aws:policy/AmazonSESFullAccess"
}
resource "aws_iam_role_policy_attachment" "sto-readonly-role-policy-attach8" {
  role       = "${aws_iam_role.iam_for_lambda.name}"
  policy_arn = "${data.aws_iam_policy.AmazonSESFullAccess.arn}"
}

# data "aws_dynamodb_table" "csye" {
#   name = "csye"
# }

resource "aws_iam_role_policy" "DynamoDBPost" {
  name = "DynamoDBPost"
  role = "${aws_iam_role.iam_for_lambda.name}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
          "Effect": "Allow",
		      "Action": [
			      "dynamodb:*"
		      ],
		      "Resource": [
			      "${aws_dynamodb_table.basic-dynamodb-table.arn}",
			      "${aws_dynamodb_table.basic-dynamodb-table.arn}/*"
		      ]
        }
    ]
}
EOF
}

/// LAMBDA function

// data "aws_iam_role" "role_lambda" {
//   name = "lambdaServiceRole"
// }

resource "aws_lambda_function" "test_lambda" {
  filename      = "lambda_function_payload.zip"
  function_name = "lambda_csye"
  role          = "${aws_iam_role.iam_for_lambda.arn}"
  handler       = "index.handler"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = "${base64sha256("lambda_function_payload.zip")}"

  runtime = "nodejs8.10"

  environment {
    variables = {
      foo = "bar"
    }
  }
} 

// creating topic and subscription for SNS
resource "aws_sns_topic" "user_recipes" {
  name = "user-recipes-topic"
}

// resource "aws_sqs_queue" "user_recipes_queue" {
//   name = "user-recipes-queue"
// }

resource "aws_lambda_permission" "with_sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.test_lambda.function_name}"
  principal     = "sns.amazonaws.com"
  source_arn    = "${aws_sns_topic.user_recipes.arn}"
}

resource "aws_sns_topic_subscription" "user_updates_sqs_target" {
  topic_arn = "${aws_sns_topic.user_recipes.arn}"
  protocol  = "lambda"
  endpoint  = "${aws_lambda_function.test_lambda.arn}"
}

///////////////////////////////Lambda policy for the User

data "aws_iam_user" "select12" {
  user_name = "circleci"
}

resource "aws_iam_policy" "lambda_policy" {
  name = "Lambda_Policy"
  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": [
                "lambda:GetFunction",
                "lambda:ListFunctions",
                "lambda:UpdateFunctionCode",
                "lambda:UpdateFunctionConfiguration"
            ],
            "Resource": [
                "${aws_lambda_function.test_lambda.arn}",
                "${aws_lambda_function.test_lambda.arn}/*"
            ]
        }]
}
POLICY              
}

resource "aws_iam_user_policy_attachment" "lambda_policy_attach" {
  user       = "${data.aws_iam_user.select12.user_name}"
  policy_arn = "${aws_iam_policy.lambda_policy.arn}"
}

//////////////////////////////ASSIGNMENT8 LAMBDA POLICIES

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
  default = ""
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

    expiration {
      days = 60
    }
  }
}


variable "lambdabucket" {
  type = string
  default = "lambda.dev.ajaygoel.me"
}

resource "aws_s3_bucket" "bucket3" {
  bucket = "${var.lambdabucket}"
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

    expiration {
      days = 60
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
                "s3:List*",
                "s3:Put*",
                "s3:Delete*"
            ],
            "Effect": "Allow",
            "Resource": [
              "${aws_s3_bucket.bucket2.arn}/*",
              "${aws_s3_bucket.bucket2.arn}",
              "${aws_s3_bucket.bucket.arn}",
              "${aws_s3_bucket.bucket.arn}/*"
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
  deployment_group_name = "csye6225-webapp-deployment"
  service_role_arn      = "${data.aws_iam_role.getRole.arn}"

    deployment_style {
    deployment_option = "WITHOUT_TRAFFIC_CONTROL"
    deployment_type   = "IN_PLACE"
  }

  load_balancer_info {
    target_group_info {
      name = "${aws_lb_target_group.main.name}"
    }
  }

  blue_green_deployment_config {
    deployment_ready_option {
      action_on_timeout = "CONTINUE_DEPLOYMENT"
    }

    green_fleet_provisioning_option {
      action = "DISCOVER_EXISTING"
    }

    terminate_blue_instances_on_deployment_success {
      action = "TERMINATE"
    }
  }

  autoscaling_groups = ["${aws_autoscaling_group.autoscaling_grp.name}"]
}
resource "aws_cloudwatch_log_group" "csye6225_fall2019" {
  name = "csye6225_fall2019"
}
resource "aws_cloudwatch_log_stream" "webapp" {
  name           = "webapp"
  log_group_name = "${aws_cloudwatch_log_group.csye6225_fall2019.name}"
}


resource "aws_launch_configuration" "as_conf" {
  name          = "asg_launch_config"

  image_id           =  var.ami
  instance_type = "t2.micro"
  iam_instance_profile =  "${aws_iam_instance_profile.EC2_instance_profile.name}"
  security_groups = ["${aws_security_group.allow_tls.id}","${aws_security_group.lb.id}"]
  associate_public_ip_address = true
  key_name = var.key_name

  depends_on = [
    aws_db_instance.main
  ]

  ebs_block_device {
      device_name = "/dev/sdf"
      delete_on_termination = true
      volume_size           = 20
      volume_type           = "gp2"
      
  }

  user_data = <<EOF
#!/bin/bash
sudo systemctl start httpd

mkdir /home/centos/.aws

sudo touch /home/centos/.aws/config

sudo touch /home/centos/.aws/credentials

sudo touch /home/centos/.env

echo "DATABASE = csye6225" >>  /home/centos/.env

echo "USER_DATA = dbuser" >>  /home/centos/.env

echo "DATABASE_PASSWORD = ${var.password}" >>  /home/centos/.env

echo "BUCKET_NAME = ${var.bucketname}" >>  /home/centos/.env

echo "HOST = ${split(":", "${aws_db_instance.main.endpoint}")[0]}" >> /home/centos/.env

echo "topic_arn = ${aws_sns_topic.user_recipes.arn}" >> /home/centos/.env

sudo mkdir -p /usr/share/collectd/

sudo touch /usr/share/collectd/types.db

  ##### END OF USER DATA

  EOF
}


resource "aws_lb" "main" {
  name               = "main-lb-tf"
  internal           = false
  load_balancer_type = "application"
  security_groups    =  ["${aws_security_group.lb.id}","${aws_security_group.allow_tls.id}"]
  subnets            =  ["${data.aws_subnet.example[0].id}", "${data.aws_subnet.example[1].id}", "${data.aws_subnet.example[2].id}"]

  enable_deletion_protection = false

  tags = {
    Environment = "production"
  }
}

resource "aws_lb_listener" "main" {
  load_balancer_arn = "${aws_lb.main.arn}"
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.cert-arn

  default_action {
    type             = "forward"
    target_group_arn = "${aws_lb_target_group.main.arn}"
  }
}

resource "aws_lb_target_group" "main" {
  name     = "tf-lb-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = "${data.aws_vpc.selected.id}"
  health_check {
    healthy_threshold = 3
    unhealthy_threshold = 3
    #timeout = 60
    interval = 30
    port = 80
  }
}

# resource "aws_lb_listener" "main1" {
#   load_balancer_arn = "${aws_lb.main.arn}"
#   port              = 80
#   protocol          = "HTTPS"
#   ssl_policy        = "ELBSecurityPolicy-2016-08"
#   certificate_arn   = var.cert-arn

#   default_action {
#     type             = "redirect"
#     redirect {
#       port        = "3000"
#       protocol    = "HTTPS"
#       status_code = "HTTP_301"
#     }
#     #target_group_arn = "${aws_lb_target_group.main1.arn}"
#   }
# }

resource "aws_autoscaling_group" "autoscaling_grp" {
  # Force a redeployment when launch configuration changes.
  # This will reset the desired capacity if it was changed due to
  # autoscaling events.
  name = "${aws_launch_configuration.as_conf.name}-asg"
  force_delete         = true
  min_size             = 3
  desired_capacity     = 3
  max_size             = 10
  default_cooldown     = 60
  launch_configuration = "${aws_launch_configuration.as_conf.name}"

  vpc_zone_identifier  = ["${data.aws_subnet.example[0].id}", "${data.aws_subnet.example[1].id}", "${data.aws_subnet.example[2].id}"]
  #load_balancers = ["${aws_elb.main.name}"]
  target_group_arns = ["${aws_lb_target_group.main.arn}"]

  # Required to redeploy without an outage.
  lifecycle {
    create_before_destroy = true
  }

  tag {
    key                 = "Name"
    value               = "csye6225_autoscaling_group"
    propagate_at_launch = true
  }

}

resource "aws_autoscaling_policy" "WebServerScaleUpPolicy" {
  name                   = "WebServerScaleUpPolicy"
  scaling_adjustment     = "1"
  adjustment_type        = "ChangeInCapacity"
  cooldown               = "60"
  autoscaling_group_name = "${aws_autoscaling_group.autoscaling_grp.name}"
}

resource "aws_autoscaling_policy" "WebServerScaleDownPolicy" {
  name                   = "WebServerScaleDownPolicy"
  scaling_adjustment     = "-1"
  adjustment_type        = "ChangeInCapacity"
  cooldown               = "60"
  autoscaling_group_name = "${aws_autoscaling_group.autoscaling_grp.name}"

}

resource "aws_cloudwatch_metric_alarm" "CPUAlarmHigh" {
  alarm_name                = "CPUAlarmHigh"
  comparison_operator       = "GreaterThanThreshold"
  evaluation_periods        = "2"
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/EC2"
  period                    = "300"
  statistic                 = "Average"
  threshold                 = "5"
  alarm_description         = "Scale-up if CPU > 5% for 10 minutes"
  insufficient_data_actions = []
  dimensions = {
    AutoScalingGroupName = "${aws_autoscaling_group.autoscaling_grp.name}"
  }
  alarm_actions = ["${aws_autoscaling_policy.WebServerScaleUpPolicy.arn}"]

}

  resource "aws_cloudwatch_metric_alarm" "CPUAlarmLow" {
  alarm_name                = "CPUAlarmLow"
  comparison_operator       = "LessThanThreshold"
  evaluation_periods        = "2"
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/EC2"
  period                    = "300"
  statistic                 = "Average"
  threshold                 = "3"
  alarm_description         = "Scale-down if CPU < 3% for 10 minutes"
  insufficient_data_actions = []
  dimensions = {
    AutoScalingGroupName = "${aws_autoscaling_group.autoscaling_grp.name}"
  }
  alarm_actions = ["${aws_autoscaling_policy.WebServerScaleDownPolicy.arn}"]
}

## Security Group for LB
resource "aws_security_group" "lb" {
  name = "terraform-lb"
  vpc_id = "${data.aws_vpc.selected.id}"
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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


  # ALLOW PORT 443
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    description = "PORT 443"
    cidr_blocks = [var.cidr_block_443]
  }
}

output "lb-value" {
  value = "${aws_lb.main.dns_name}"
}


resource "aws_route53_record" "www" {
  zone_id = var.zone-id
  allow_overwrite = true
  name            = ""
  #ttl             = 60
  type            = "A"

  alias {
    name                   = "${aws_lb.main.dns_name}"
    zone_id                = "${aws_lb.main.zone_id}"
    evaluate_target_health = false
  }
}

## Associate AWS WAF to ALB

resource "aws_wafregional_sql_injection_match_set" "sql_injection_match_set" {
  name = "tf-sql_injection_match_set"

  sql_injection_match_tuple {
    text_transformation = "URL_DECODE"

    field_to_match {
      type = "QUERY_STRING"
    }
  }
}

resource "aws_wafregional_rule" "main" {
  name        = "tfWAFRule"
  metric_name = "tfWAFRule"

  predicate {
    data_id = "${aws_wafregional_sql_injection_match_set.sql_injection_match_set.id}"
    negated = false
    type    = "SqlInjectionMatch"
  }
}

resource "aws_wafregional_ipset" "ipset" {
  name = "tfIPSet"

  ip_set_descriptor {
    type  = "IPV4"
    value = "192.0.7.0/24"
  }
}

resource "aws_wafregional_rate_based_rule" "wafrule" {
  depends_on  = ["aws_wafregional_ipset.ipset"]
  name        = "tfWAFRuleRate"
  metric_name = "tfWAFRuleRate"

  rate_key   = "IP"
  rate_limit = 10000

  predicate {
    data_id = "${aws_wafregional_ipset.ipset.id}"
    negated = false
    type    = "IPMatch"
  }
}

resource "aws_wafregional_rule" "wafrule" {
  name        = "tfWAFRule"
  metric_name = "tfWAFRule"

  predicate {
    data_id = "${aws_wafregional_ipset.ipset.id}"
    negated = false
    type    = "IPMatch"
  }
}

resource "aws_wafregional_xss_match_set" "xss_match_set" {
  name = "xss_match_set"

  xss_match_tuple {
    text_transformation = "NONE"

    field_to_match {
      type = "URI"
    }
  }

  xss_match_tuple {
    text_transformation = "NONE"

    field_to_match {
      type = "QUERY_STRING"
    }
  }
}

resource "aws_wafregional_rule" "xssrule" {
  name        = "tfWAFRuleXss"
  metric_name = "tfWAFRuleXss"

  predicate {
    data_id = "${aws_wafregional_xss_match_set.xss_match_set.id}"
    negated = false
    type    = "XssMatch"
  }
}

resource "aws_wafregional_geo_match_set" "geo_match_set" {
  name = "geo_match_set"

  geo_match_constraint {
    type  = "Country"
    value = "US"
  }

  geo_match_constraint {
    type  = "Country"
    value = "CA"
  }
}

resource "aws_wafregional_rule" "georule" {
  name        = "tfWAFRuleGeo"
  metric_name = "tfWAFRuleGeo"

  predicate {
    data_id = "${aws_wafregional_geo_match_set.geo_match_set.id}"
    negated = false
    type    = "GeoMatch"
  }
}

resource "aws_wafregional_byte_match_set" "byte_set" {
  name = "tf_waf_byte_match_set"

  byte_match_tuples {
    text_transformation   = "NONE"
    target_string         = "badrefer1"
    positional_constraint = "CONTAINS"

    field_to_match {
      type = "HEADER"
      data = "referer"
    }
  }
}

resource "aws_wafregional_rule" "byterule" {
  name        = "tfWAFRuleByte"
  metric_name = "tfWAFRuleByte"

  predicate {
    data_id = "${aws_wafregional_byte_match_set.byte_set.id}"
    negated = false
    type    = "ByteMatch"
  }
}

resource "aws_wafregional_size_constraint_set" "size_constraint_set" {
  name = "tfsize_constraints"

  size_constraints {
    text_transformation = "NONE"
    comparison_operator = "LE"
    size                = "40960"

    field_to_match {
      type = "BODY"
    }
  }
}

resource "aws_wafregional_rule" "sizerule" {
  name        = "tfWAFRuleSize"
  metric_name = "tfWAFRuleSize"

  predicate {
    data_id = "${aws_wafregional_size_constraint_set.size_constraint_set.id}"
    negated = false
    type    = "SizeConstraint"
  }
}

resource "aws_wafregional_regex_match_set" "main" {
  name = "main"

  regex_match_tuple {
    field_to_match {
      data = "User-Agent"
      type = "HEADER"
    }

    regex_pattern_set_id = "${aws_wafregional_regex_pattern_set.main.id}"
    text_transformation  = "NONE"
  }
}

resource "aws_wafregional_regex_pattern_set" "main" {
  name                  = "main"
  regex_pattern_strings = ["one", "two"]
}

resource "aws_wafregional_rule" "regexrule" {
  name        = "tfWAFRuleRegex"
  metric_name = "tfWAFRuleRegex"

  predicate {
    data_id = "${aws_wafregional_regex_match_set.main.id}"
    negated = false
    type    = "RegexMatch"
  }
}

resource "aws_wafregional_web_acl" "main" {
  name        = "main"
  metric_name = "acl"

  default_action {
    type = "ALLOW"
  }

  rule {
    action {
      type = "BLOCK"
    }

    priority = 1
    rule_id  = "${aws_wafregional_rule.main.id}"
  }

    rule {
    action {
      type = "BLOCK"
    }

    priority = 2
    rule_id  = "${aws_wafregional_rule.wafrule.id}"
    type     = "REGULAR"
  }

    rule {
    action {
      type = "BLOCK"
    }

    priority = 3
    rule_id  = "${aws_wafregional_rule.xssrule.id}"
    type     = "REGULAR"
  }


  rule {
    action {
      type = "ALLOW"
    }

    priority = 4
    rule_id  = "${aws_wafregional_rule.georule.id}"
    type     = "REGULAR"
  }

  rule {
    action {
      type = "BLOCK"
    }

    priority = 5
    rule_id  = "${aws_wafregional_rule.byterule.id}"
    type     = "REGULAR"
  }

    rule {
    action {
      type = "ALLOW"
    }

    priority = 6
    rule_id  = "${aws_wafregional_rule.sizerule.id}"
    type     = "REGULAR"
  }

  rule {
    action {
      type = "BLOCK"
    }

    priority = 7
    rule_id  = "${aws_wafregional_rule.regexrule.id}"
    type     = "REGULAR"
  }
}

resource "aws_wafregional_web_acl_association" "main" {
  resource_arn = "${aws_lb.main.arn}"
  web_acl_id   = "${aws_wafregional_web_acl.main.id}"
}

