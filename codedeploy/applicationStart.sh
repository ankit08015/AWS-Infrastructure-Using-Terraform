#!/bin/bash
##### CLOUD WATCH AGENT

# run the node js application
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s
cd /home/centos/ccwebapp/webapp/app_psql
forever start index.js
# node index.js
