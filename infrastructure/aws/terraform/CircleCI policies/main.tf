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

variable "lambdabucket" {
  type = string
  default = ""
}

# Application Security Group



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
          "Sid": "VisualEditor0",
          "Effect": "Allow",
          "Action": [
              "s3:PutObject",
              "s3:ListBucket"
          ],
          "Resource": [
              "arn:aws:s3:::${var.bucketname}",
              "arn:aws:s3:::${var.bucketname}/*",
              "arn:aws:s3:::${var.lambdabucket}",
              "arn:aws:s3:::${var.lambdabucket}/*"
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
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:CreateDeployment",
        "codedeploy:GetDeployment"
      ],
      "Resource": [
        "*"
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
      "Resource": "*"
  }]
}
POLICY              
}
resource "aws_iam_user_policy_attachment" "circleci-ec2-ami-attach" {
  user       = "${data.aws_iam_user.select.user_name}"
  policy_arn = "${aws_iam_policy.policy-circleci-ec2-ami.arn}"
}
