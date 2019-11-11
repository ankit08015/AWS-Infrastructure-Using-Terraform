 variable "vpc" {
  type = string
  default = ""
}
 
 data "aws_vpc" "selected" {
   tags = {
     Name = var.vpc
   }
 }

data "aws_subnet" "example" {
   count = "${length(data.aws_subnet_ids.example.ids)}"
   id    = "${tolist(data.aws_subnet_ids.example.ids)[count.index]}"
 }

resource "aws_launch_configuration" "as_conf" {
  name          = "asg_launch_config"
  image_id      = "ami-0c2f175147b061a1a"
  instance_type = "t2.micro"
  key_name = "dev_pair"
  associate_public_ip_address = true
  user_data = "${aws_iam_instance_profile.EC2_instance_profile.user_data}"
  iam_instance_profile =  "${aws_iam_instance_profile.EC2_instance_profile.name}"
  security_groups = ["${aws_security_group.allow_tls.id}"]
}


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

resource "aws_iam_policy" "autoscaling_policy" {
  name        = "Autoscaling-policy"
  description = "An Autoscaling policy"

   policy = <<EOF
 {
	"WebServerScaleUpPolicy": {
		"Type": "AWS::AutoScaling::ScalingPolicy",
		"Properties": {
			"AdjustmentType": "ChangeInCapacity",
			"AutoScalingGroupName": {
				"Ref": "WebServerGroup"
			},
			"Cooldown": "60",
			"ScalingAdjustment": "1"
		}
	},
	"WebServerScaleDownPolicy": {
		"Type": "AWS::AutoScaling::ScalingPolicy",
		"Properties": {
			"AdjustmentType": "ChangeInCapacity",
			"AutoScalingGroupName": {
				"Ref": "WebServerGroup"
			},
			"Cooldown": "60",
			"ScalingAdjustment": "-1"
		}
	},
	"CPUAlarmHigh": {
		"Type": "AWS::CloudWatch::Alarm",
		"Properties": {
			"AlarmDescription": "Scale-up if CPU > 5% for 10 minutes",
			"MetricName": "CPUUtilization",
			"Namespace": "AWS/EC2",
			"Statistic": "Average",
			"Period": "300",
			"EvaluationPeriods": "2",
			"Threshold": "5",
			"AlarmActions": [{
				"Ref": "WebServerScaleUpPolicy"
			}],
			"Dimensions": [{
				"Name": "AutoScalingGroupName",
				"Value": {
					"Ref": "WebServerGroup"
				}
			}],
			"ComparisonOperator": "GreaterThanThreshold"
		}
	},
	"CPUAlarmLow": {
		"Type": "AWS::CloudWatch::Alarm",
		"Properties": {
			"AlarmDescription": "Scale-down if CPU < 3% for 10 minutes",
			"MetricName": "CPUUtilization",
			"Namespace": "AWS/EC2",
			"Statistic": "Average",
			"Period": "300",
			"EvaluationPeriods": "2",
			"Threshold": "3",
			"AlarmActions": [{
				"Ref": "WebServerScaleDownPolicy"
			}],
			"Dimensions": [{
				"Name": "AutoScalingGroupName",
				"Value": {
					"Ref": "WebServerGroup"
				}
			}],
			"ComparisonOperator": "LessThanThreshold"
		}
	}
}
 EOF
}

 resource "aws_iam_user_policy_attachment" "autoscaling-policy-attach" {
   user       = "${data.aws_iam_user.select.user_name}"
   policy_arn = "${aws_iam_policy.autoscaling_policy.arn}"
 }


## Creating AutoScaling Group
resource "aws_autoscaling_group" "example" {
  launch_configuration = "${aws_launch_configuration.as_conf.id}"
  availability_zones = ["${data.aws_availability_zones.all.names}"]
  min_size = 2
  max_size = 10
  load_balancers = ["${aws_elb.example.name}"]
  health_check_type = "ELB"
  tag {
    key = "Name"
    value = "terraform-asg-example"
    propagate_at_launch = true
  }
}

## Security Group for ELB
resource "aws_security_group" "elb" {
  name = "terraform-example-elb"
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
}

### Creating ELB
resource "aws_elb" "example" {
  name = "terraform-asg-example"
  security_groups = ["${aws_security_group.elb.id}"]
  availability_zones = ["us-east-1a"]
  health_check {
    healthy_threshold = 2
    unhealthy_threshold = 2
    timeout = 3
    interval = 30
    target = "HTTP:3000/"
  }
  listener {
    lb_port = 80
    lb_protocol = "http"
    instance_port = "3000"
    instance_protocol = "http"
  }
}