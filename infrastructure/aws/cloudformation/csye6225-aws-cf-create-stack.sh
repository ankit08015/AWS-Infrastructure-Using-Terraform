#!/usr/bin/env bash

STACK_NAME=$1
AWS_REGION=$2
#EAST= "us-east-1"
VPC_NAME=$3
VPC_CIDR=$4

SUBNET1=$5
SUBNET2=$6
SUBNET3=$7

if test "$#" -ne 7; then
    echo "Illegal number of parameters. Please provide all required parameters as follows:"
    echo "csye6225-aws-cf-create-stack.sh STACK_NAME REGION_NAME VPC_NAME VPC_CIDR_BLOCK SUBNETCIDR1 SUBNETCIDR2 SUBNETCIDR3"
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

echo "Creating stack..."
STACK_ID=$( \
  aws cloudformation create-stack \
  --stack-name ${STACK_NAME} \
  --template-body file://csye6225-cf-networking.json \
  --capabilities CAPABILITY_IAM \
  --parameters ParameterKey=Name,ParameterValue=$VPC_NAME \
               ParameterKey=VPCCIDR,ParameterValue=$VPC_CIDR \
               ParameterKey=SubnetCIDR1,ParameterValue=$SUBNET1 \
               ParameterKey=SubnetCIDR2,ParameterValue=$SUBNET2 \
               ParameterKey=SubnetCIDR3,ParameterValue=$SUBNET3 \
  | jq -r .StackId \
)

echo "Waiting on ${STACK_ID} create completion..."
aws cloudformation wait stack-create-complete --stack-name ${STACK_ID}