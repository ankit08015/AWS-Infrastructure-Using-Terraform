#!/bin/sh
# handle_error()
# {
#     if [ -z "$1" ] 
#      then exit 
#     fi
# }

# handle_creation_error()
# {
#     if [ $1 -ne "0" ] 
#      then exit 
#     fi
# }

if test "$#" -ne 6; then
    echo "Illegal number of parameters. Please provide all required parameters as follows:"
    echo "sh csye6225-aws-networking-setup.sh <AWS_REGION> <VPC_NAME> <VPC_CIDR_BLOCK> <SUBNET1_CIDR_BLOCK> <SUBNET2_CIDR_BLOCK> <SUBNET3_CIDR_BLOCK>"
    exit 1
fi


AWS_REGION=$1
VPC_NAME=$2
#"aj"
VPC_CIDR=$3
#"10.0.0.0/16"
#us-east-1 aj 10.0.0.0/16
#INTERNET_GATEWAY_NAME="MY INTERNET GATEWAY"
#ROUTE_TABLE_NAME="RT-CLI"

echo "==================================================================="
echo "Creating VPC in preferred region..."
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block $VPC_CIDR \
  --query 'Vpc.{VpcId:VpcId}' \
  --output text \
  --region $AWS_REGION)

handle_error $VPC_ID
echo "  VPC ID '$VPC_ID' CREATED in '$AWS_REGION' region."

echo "==================================================================="

# Add Name tag to VPC
aws ec2 create-tags \
  --resources $VPC_ID \
  --tags "Key=Name,Value=$VPC_NAME-csye6225-vpc" \
  --region $AWS_REGION
echo "  VPC ID '$VPC_ID' NAMED as '$VPC_NAME-csye6225-vpc'."
echo "==================================================================="


SUBNET_PUBLIC_CIDR=$4
#"10.0.1.0/24"
SUBNET_PUBLIC_AZ="${AWS_REGION}a"
## SUBNET_PUBLIC_NAME="10.0.1.0 - us-east-1a"

echo "==================================================================="

# Create Public Subnet 1
echo "Creating Public Subnet..."
SUBNET_PUBLIC_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block $SUBNET_PUBLIC_CIDR \
  --availability-zone $SUBNET_PUBLIC_AZ \
  --query 'Subnet.{SubnetId:SubnetId}' \
  --output text \
  --region $AWS_REGION)

handle_error $SUBNET_PUBLIC_ID
echo "  Subnet ID '$SUBNET_PUBLIC_ID' CREATED in '$SUBNET_PUBLIC_AZ'" \
  "Availability Zone."
echo "==================================================================="


# Add Name tag to Public Subnet 1
aws ec2 create-tags \
  --resources $SUBNET_PUBLIC_ID \
  --tags "Key=Name,Value=$VPC_NAME-csye6225-subnet1" \
  --region $AWS_REGION
echo "  Subnet ID 1 '$SUBNET_PUBLIC_ID' NAMED as" \
  "'$VPC_NAME-csye6225-subnet1'."
echo "==================================================================="

SUBNET_PUBLIC_CIDR2=$5
"10.0.2.0/24"
SUBNET_PUBLIC_AZ="${AWS_REGION}b"
##SUBNET_PUBLIC_NAME2="10.0.2.0 - us-east-1b"

echo "==================================================================="

# Create Public Subnet 2
echo "Creating Public Subnet..."
SUBNET_PUBLIC_ID2=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block $SUBNET_PUBLIC_CIDR2 \
  --availability-zone $SUBNET_PUBLIC_AZ \
  --query 'Subnet.{SubnetId:SubnetId}' \
  --output text \
  --region $AWS_REGION)

handle_error $SUBNET_PUBLIC_ID2

echo "  Subnet ID 2'$SUBNET_PUBLIC_ID2' CREATED in '$SUBNET_PUBLIC_AZ' " \
  "Availability Zone."
echo "==================================================================="


# Add Name tag to Public Subnet 2
aws ec2 create-tags \
  --resources $SUBNET_PUBLIC_ID2 \
  --tags "Key=Name,Value=$VPC_NAME-csye6225-subnet2" \
  --region $AWS_REGION
echo "  Subnet ID '$SUBNET_PUBLIC_ID2' NAMED as" \
  "'$VPC_NAME-csye6225-subnet2'."
echo "==================================================================="

SUBNET_PUBLIC_CIDR3=$6
#"10.0.3.0/24"
SUBNET_PUBLIC_AZ="${AWS_REGION}c"
SUBNET_PUBLIC_NAME3="10.0.3.0 - us-east-1c"

echo "==================================================================="

# Create Public Subnet 3
echo "Creating Public Subnet..."
SUBNET_PUBLIC_ID3=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block $SUBNET_PUBLIC_CIDR3 \
  --availability-zone $SUBNET_PUBLIC_AZ \
  --query 'Subnet.{SubnetId:SubnetId}' \
  --output text \
  --region $AWS_REGION)

handle_error $SUBNET_PUBLIC_ID3
echo "  Subnet ID 3'$SUBNET_PUBLIC_ID3' CREATED in '$SUBNET_PUBLIC_AZ " \
  "Availability Zone."
echo "==================================================================="


# Add Name tag to Public Subnet 3
aws ec2 create-tags \
  --resources $SUBNET_PUBLIC_ID3 \
  --tags "Key=Name,Value=$VPC_NAME-csye6225-subnet3" \
  --region $AWS_REGION
echo "  Subnet ID '$SUBNET_PUBLIC_ID3' NAMED as" \
  "'$VPC_NAME-csye6225-subnet3'."
echo "==================================================================="


# Create Internet gateway
echo "Creating Internet Gateway..."
IGW_ID=$(aws ec2 create-internet-gateway \
  --query 'InternetGateway.{InternetGatewayId:InternetGatewayId}' \
  --output text \
  --region $AWS_REGION)

handle_error $IGW_ID
echo "  Internet Gateway ID '$IGW_ID' CREATED."
echo "==================================================================="


# Add Name tag to Interney Gateway
aws ec2 create-tags \
  --resources $IGW_ID \
  --tags "Key=Name,Value=$VPC_NAME-csye6225-ig" \
  --region $AWS_REGION

echo "  IGW ID '$IGW_ID' NAMED as '$VPC_NAME-csye6225-ig'."
echo "==================================================================="


# Attach Internet gateway to your VPC
aws ec2 attach-internet-gateway \
  --vpc-id $VPC_ID \
  --internet-gateway-id $IGW_ID \
  --region $AWS_REGION

handle_error $IGW_ID
echo "  Internet Gateway ID '$IGW_ID' ATTACHED to VPC ID '$VPC_ID'."
echo "==================================================================="


# Create Route Table
echo "Creating Route Table..."
ROUTE_TABLE_ID=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --query 'RouteTable.{RouteTableId:RouteTableId}' \
  --output text \
  --region $AWS_REGION)

handle_error $ROUTE_TABLE_ID
echo "  Route Table ID '$ROUTE_TABLE_ID' CREATED."
echo "==================================================================="

# Create tag for Route Table
aws ec2 create-tags \
  --resources $ROUTE_TABLE_ID \
  --tags "Key=Name,Value=$VPC_NAME-csye6225-rt" \
  --region $AWS_REGION

echo "  RTI ID '$ROUTE_TABLE_ID' NAMED as '$VPC_NAME-csye6225-rt'."
echo "==================================================================="

echo "Associating subnets to route table..."
aws ec2 associate-route-table --route-table-id $ROUTE_TABLE_ID --subnet-id $SUBNET_PUBLIC_ID
aws ec2 associate-route-table --route-table-id $ROUTE_TABLE_ID --subnet-id $SUBNET_PUBLIC_ID2
aws ec2 associate-route-table --route-table-id $ROUTE_TABLE_ID --subnet-id $SUBNET_PUBLIC_ID3
echo "Subnets Associated"

echo "==================================================================="


# Create route to Internet Gateway
RESULT=$(aws ec2 create-route \
  --route-table-id $ROUTE_TABLE_ID \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id $IGW_ID \
  --region $AWS_REGION)
echo "  Route to '0.0.0.0/0' via Internet Gateway ID '$IGW_ID' ADDED to" \
  "Route Table ID '$ROUTE_TABLE_ID'."
echo "==================================================================="


echo "COMPLETED"
