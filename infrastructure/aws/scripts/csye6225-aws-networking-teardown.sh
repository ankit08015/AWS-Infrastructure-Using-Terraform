#!/bin/sh

#!/bin/bash

STACK_NAME="$1"
if [ -z "$STACK_NAME" ];then
	echo "No parameters were given"
	exit 0
fi

## Getting the VPC ID
vpc_name="$STACK_NAME-csye6225-vpc"
vpc_id=$(aws ec2 describe-vpcs --query "Vpcs[?Tags[?Key=='Name']|[?Value=='$vpc_name']].VpcId" --output text)
echo "VPC ID: '$vpc_id'"

if [ -z "$vpc_id" ];then
	echo "No VPCs found"
	exit 0
fi


ig_name="$STACK_NAME-csye6225-ig"
ig_id=$(aws ec2 describe-internet-gateways --query "InternetGateways[?Tags[?Key=='Name']|[?Value=='$ig_name']].InternetGatewayId" --output text)
echo "IG ID: '$ig_id'"

rt_name="$STACK_NAME-csye6225-rt"
route_table_id=$(aws ec2 describe-route-tables --query "RouteTables[?Tags[?Key=='Name']|[?Value=='$rt_name']].RouteTableId" --output text)
echo "Route Table ID: '$route_table_id'"

subnet1_name="$STACK_NAME-csye6225-subnet1"
subnet1_id=$(aws ec2 describe-subnets --query "Subnets[?Tags[?Key=='Name']|[?Value=='$subnet1_name']].SubnetId" --output text)
echo "Subnet 1 ID: '$subnet1_id'"

subnet2_name="$STACK_NAME-csye6225-subnet2"
subnet2_id=$(aws ec2 describe-subnets --query "Subnets[?Tags[?Key=='Name']|[?Value=='$subnet2_name']].SubnetId" --output text)
echo "Subnet 2 ID: '$subnet2_id'"

subnet3_name="$STACK_NAME-csye6225-subnet3"
subnet3_id=$(aws ec2 describe-subnets --query "Subnets[?Tags[?Key=='Name']|[?Value=='$subnet3_name']].SubnetId" --output text)
echo "Subnet 3 ID: '$subnet3_id'"


#Delete Subnets
aws ec2 delete-subnet --subnet-id $subnet1_id
delete1_subnet=$?
if [ $delete1_subnet -eq 0 ]; then
	echo "Subnet 1 deleted successfully"
else
  	echo "Failed to delete subnet 1"
	exit 0
fi
echo "======================== DELETED SUBNET1 ============================"


aws ec2 delete-subnet --subnet-id $subnet2_id
delete2_subnet=$?
if [ $delete2_subnet -eq 0 ]; then
	echo "Subnet 2 deleted successfully"
else
  	echo "Failed to delete subnet 2"
	exit 0
fi
echo "======================== DELETED SUBNET2 ============================"



aws ec2 delete-subnet --subnet-id $subnet3_id
delete3_subnet=$?
if [ $delete3_subnet -eq 0 ]; then
	echo "Subnet 3 deleted successfully"
else
  	echo "Failed to delete subnet 3"
	exit 0
fi
echo "======================== DELETED SUBNET3 ============================"

aws ec2 delete-route --route-table-id $ROUTE_TABLE_ID --destination-cidr-block 0.0.0.0/0
echo "======================== DELETED ROUTE ============================"

#Delete Route Table
aws ec2 delete-route-table --route-table-id $route_table_id
delete_rt=$?
if [ $delete_rt -eq 0 ]; then
	echo "Route Table deleted successfully"
else
  	echo "Failed to delete route table"
	exit 0
fi

echo "======================== DELETED ROUTE TABLE ============================"


#Detach Internet Gateway
aws ec2 detach-internet-gateway --internet-gateway-id $ig_id --vpc-id $vpc_id
detach_ig=$?
if [ $detach_ig -eq 0 ]; then
	echo "Internet Gateway detached from VPC successfully"
else
  	echo "Failed to detach IG from VPC"
	exit 0
fi

echo "======================== DETACH INTERNET GATEWAY ============================"



#Delete Internet Gateway
aws ec2 delete-internet-gateway --internet-gateway-id $ig_id
delete_ig=$?
if [ $delete_ig -eq 0 ]; then
	echo "Internet Gateway deleted successfully"
else
  	echo "Failed to delete IG"
	exit 0
fi

echo "======================== DELETED INTERNEY GATEWAT ============================"


#Delete VPC
aws ec2 delete-vpc --vpc-id $vpc_id
delete_vpc=$?
if [ $delete_vpc -eq 0 ]; then
	echo "VPC deleted successfully"
else
  	echo "Failed to delete VPC"
	exit 0
fi

echo "======================== DELETED VPC ============================"
echo "Completed."

