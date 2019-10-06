AWS_REGION="us-east-1"
VPC_NAME="My VPC"
VPC_CIDR="10.0.0.0/16"

echo "Creating VPC in preferred region..."
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block $VPC_CIDR \
  --query 'Vpc.{VpcId:VpcId}' \
  --output text \
  --region $AWS_REGION)
echo "  VPC ID '$VPC_ID' CREATED in '$AWS_REGION' region."


------------------------------------------------------------
aws ec2 delete-vpc --vpc-id vpc-0dbebee256144d1c5
aws ec2 delete-vpc --vpc-id vpc-04a3b1513e06ccd16
aws ec2 delete-vpc --vpc-id vpc-07603c448f1f3f06f
aws ec2 delete-vpc --vpc-id vpc-091d55312d720990c
aws ec2 delete-vpc --vpc-id vpc-01bcdd21a6237eff5
---------------------------------------------------------------


# Add Name tag to VPC
aws ec2 create-tags \
  --resources $VPC_ID \
  --tags "Key=Name,Value=$VPC_NAME" \
  --region $AWS_REGION
echo "  VPC ID '$VPC_ID' NAMED as '$VPC_NAME'."

SUBNET_PUBLIC_CIDR="10.0.1.0/24"
SUBNET_PUBLIC_AZ="us-east-1a"
SUBNET_PUBLIC_NAME="10.0.1.0 - us-east-1a"


# Create Public Subnet 1
echo "Creating Public Subnet..."
SUBNET_PUBLIC_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block $SUBNET_PUBLIC_CIDR \
  --availability-zone $SUBNET_PUBLIC_AZ \
  --query 'Subnet.{SubnetId:SubnetId}' \
  --output text \
  --region $AWS_REGION)
echo "  Subnet ID '$SUBNET_PUBLIC_ID' CREATED in '$SUBNET_PUBLIC_AZ'" \
  "Availability Zone."


---------------------------------------------------
aws ec2 delete-subnet --subnet-id $SUBNET_PUBLIC_ID

---------------------------------------------------


# Add Name tag to Public Subnet
aws ec2 create-tags \
  --resources $SUBNET_PUBLIC_ID \
  --tags "Key=Name,Value=$SUBNET_PUBLIC_NAME" \
  --region $AWS_REGION
echo "  Subnet ID '$SUBNET_PUBLIC_ID' NAMED as" \
  "'$SUBNET_PUBLIC_NAME'."


# Create Internet gateway
echo "Creating Internet Gateway..."
IGW_ID=$(aws ec2 create-internet-gateway \
  --query 'InternetGateway.{InternetGatewayId:InternetGatewayId}' \
  --output text \
  --region $AWS_REGION)
echo "  Internet Gateway ID '$IGW_ID' CREATED."

-------------------------------------------------
aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID
-------------------------------------------------

# Attach Internet gateway to your VPC
aws ec2 attach-internet-gateway \
  --vpc-id $VPC_ID \
  --internet-gateway-id $IGW_ID \
  --region $AWS_REGION
echo "  Internet Gateway ID '$IGW_ID' ATTACHED to VPC ID '$VPC_ID'."

-----------------------------------------------------------------------------------
aws ec2 detach-internet-gateway --internet-gateway-id igw-c0a643a9 --vpc-id $VPC_ID
--------------------------------------------------------------------------------

# Create Route Table
echo "Creating Route Table..."
ROUTE_TABLE_ID=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --query 'RouteTable.{RouteTableId:RouteTableId}' \
  --output text \
  --region $AWS_REGION)
echo "  Route Table ID '$ROUTE_TABLE_ID' CREATED."

-------------------------------------------------
aws ec2 delete-route-table --route-table-id $ROUTE_TABLE_ID
-------------------------------------------------

# Create route to Internet Gateway
RESULT=$(aws ec2 create-route \
  --route-table-id $ROUTE_TABLE_ID \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id $IGW_ID \
  --region $AWS_REGION)
echo "  Route to '0.0.0.0/0' via Internet Gateway ID '$IGW_ID' ADDED to" \
  "Route Table ID '$ROUTE_TABLE_ID'."

-------------------------------------------------
aws ec2 delete-route --route-table-id $ROUTE_TABLE_ID --destination-cidr-block 0.0.0.0/0
-------------------------------------------------