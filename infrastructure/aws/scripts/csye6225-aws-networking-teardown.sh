aws ec2 delete-route --route-table-id $ROUTE_TABLE_ID --destination-cidr-block 0.0.0.0/0
echo "======================== DELETED ROUTE ============================"

aws ec2 delete-route-table --route-table-id $ROUTE_TABLE_ID
echo "======================== DELETED ROUTE TABLE ============================"

aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID
echo "======================== DETACH INTERNET GATEWAY ============================"

aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID
echo "======================== DELETED INTERNEY GATEWAT ============================"

aws ec2 delete-subnet --subnet-id $SUBNET_PUBLIC_ID
echo "======================== DELETED SUBNET ============================"

aws ec2 delete-subnet --subnet-id $SUBNET_PUBLIC_ID2
echo "======================== DELETED SUBNET2 ============================"

aws ec2 delete-subnet --subnet-id $SUBNET_PUBLIC_ID3
echo "======================== DELETED SUBNET3 ============================"

aws ec2 delete-vpc --vpc-id $VPC_ID
echo "======================== DELETED VPC ============================"
echo "Completed."
