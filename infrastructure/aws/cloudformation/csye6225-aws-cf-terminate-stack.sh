#!/usr/bin/env bash

export AWS_PROFILE=dev

STACK_NAME=$1

if [ -z "$1" ]
  then
    echo "No STACK_NAME argument supplied"
    exit 1
fi

#DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Deleting stack..."
STACK_ID=$( \
  /home/ankit/.local/bin/aws cloudformation delete-stack --stack-name ${STACK_NAME} \
  | jq -r .StackId \
)

echo "Waiting on ${STACK_NAME} delete completion..."
/home/ankit/.local/bin/aws cloudformation wait stack-delete-complete --stack-name ${STACK_NAME}
echo "${STACK_NAME} deleted"