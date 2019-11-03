#!/bin/bash
#cd /home/centos/
#./confAws.sh
# Further steps: like to stop the application later on but no step as of now.
#/home/centos/./confAws.sh

mv /home/centos/.env /home/centos/ccwebapp/webapp/app_psql
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s

cd /home/centos/ccwebapp/webapp/app_psql
npm install
cd /home/centos/ccwebapp/webapp/app_psql
node index.js