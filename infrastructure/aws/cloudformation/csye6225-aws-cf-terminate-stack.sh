#!/usr/bin/env bash

STACK_NAME=$1
AWS_REGION=$2

if test "$#" -ne 2; then
    echo "Illegal number of parameters. Please provide all required parameters as follows:"
    echo "csye6225-aws-cf-terminate-stack.sh STACK_NAME REGION_NAME"
    exit 1
fi

if [ -z "$1" ]
  then
    echo "No STACK_NAME argument supplied"
    exit 1
fi

if [ $AWS_REGION = "us-east-1" ]
  then
    export AWS_PROFILE=dev
elif [ $AWS_REGION = "us-east-2" ]
  then
    export AWS_PROFILE=prod
else
    echo "Wrong region name"
    exit 1
fi


if [ -z "$1" ]
  then
    echo "No STACK_NAME argument supplied"
    exit 1
fi

#DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Deleting stack..."
STACK_ID=$( \
aws cloudformation delete-stack --stack-name ${STACK_NAME} \
  | jq -r .StackId \
)

echo "Waiting on ${STACK_NAME} delete completion..."
aws cloudformation wait stack-delete-complete --stack-name ${STACK_NAME}
echo "${STACK_NAME} deleted"