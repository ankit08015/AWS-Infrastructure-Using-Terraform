#!/bin/bash
##### CLOUD WATCH AGENT

# run the node js application
sudo mv /home/centos/.env /home/centos/ccwebapp/app_psql
cd /home/centos/ccwebapp/webapp/app_psql
node index.js