#!/bin/bash
# doing npm install for the webapp
sudo mv home/centos/.env /home/centos/ccwebapp/webapp/app_psql/

chmod 777 /home/centos/confAws.sh 

(cd /home/centos && ./confAws.sh)