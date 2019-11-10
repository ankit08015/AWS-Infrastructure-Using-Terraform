// creating topic and subscription for SNS
resource "aws_sns_topic" "user_recipes" {
  name = "user-recipes-topic"
}

resource "aws_sqs_queue" "user_recipes_queue" {
  name = "user-recipes-queue"
}

resource "aws_sns_topic_subscription" "user_updates_sqs_target" {
  topic_arn = "${aws_sns_topic.user_recipes.arn}"
  protocol  = "sqs"
  endpoint  = "${aws_sqs_queue.user_recipes_queue.arn}"
}

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

/// LAMBDA function

resource "aws_iam_role" "iam_for_lambda2" {
  name = "csye6225-lambda"
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


data "aws_iam_role" "role_lambda" {
  name = "lambdaServiceRole"
}


resource "aws_lambda_function" "test_lambda" {
  filename      = "lambda_function_payload.zip"
  function_name = "csye6225-lambda-function"
  role          = "${data.aws_iam_role.role_lambda.arn}"
  handler       = "exports.handler"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  //source_code_hash = "${filebase64sha256("lambda_function_payload.zip")}"
  runtime = "nodejs8.10"

  // environment {
  //   variables = {
  //     foo = "bar"
  //   }
  // }
}