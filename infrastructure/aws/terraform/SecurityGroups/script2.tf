// resource "aws_iam_role" "Role3" {
//   name = "EC2AutoscalingServiceRole"    

// assume_role_policy = <<EOF
// {
//   "Version": "2012-10-17",
//   "Statement": [
//     {
//       "Sid": "",
//       "Effect": "Allow",
//       "Principal": {
//         "Service": "EC2 Auto Scaling"
//       },
//       "Action": "sts:AssumeRole"
//     }
//   ]
// }
// EOF
// }

//   resource "aws_iam_role_policy_attachment" "AutoScalingServiceRolePolicy" {
//   policy_arn = "arn:aws:iam::aws:policy/aws-service-role/AutoScalingServiceRolePolicy"
//   role       = "${aws_iam_role.Role3.name}"

// }

// resource "aws_iam_instance_profile" "AutoScaling_instance_profile" {
//   name = "AutoScaling_instance_profile"
//   role = "${aws_iam_role.Role3.name}"
// }
resource "aws_sns_topic" "user_recipes" {
  name = "user-recipes-links"
  delivery_policy = <<EOF
{
  "http": {
    "defaultHealthyRetryPolicy": {
      "minDelayTarget": 20,
      "maxDelayTarget": 20,
      "numRetries": 3,
      "numMaxDelayRetries": 0,
      "numNoDelayRetries": 0,
      "numMinDelayRetries": 0,
      "backoffFunction": "linear"
    },
    "disableSubscriptionOverrides": false,
    "defaultThrottlePolicy": {
      "maxReceivesPerSecond": 1
    }
  }
}
EOF
}