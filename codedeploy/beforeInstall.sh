#!/bin/bash
#sudo chmod 777 /home/centos/confAws.sh
#cd /home/centos/
#./confAws.sh
mv /home/centos/.env /home/centos/ccwebapp/webapp/app_psql
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s

cd /home/centos/ccwebapp/webapp/app_psql
sudo forever stop index.js
forever start index.js