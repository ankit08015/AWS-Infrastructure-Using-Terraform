# CSYE 6225 - Fall 2019

## Team Information

| Name | NEU ID | Email Address |  
| Ankit Yadav | 001271369 | yadav.ank@husky.neu.edu |  
| Ajay Goel | 001897443 | goel.aj@husky.neu.edu |  
| Akshay Nandakumar Mahajanshetti | 001893697 | mahajanshetti.a@husky.neu.edu |  


## Technology Stack

### Backend: Node.js
### Database: PostgresSQL
 

## Build Instructions

1. Clone the project using ` git clone git@github.com:ankit08015/ccwebapp.git `
2. Create Database using commands in folder `webapp/Assignment2/postgre_commands`
3. Navigate to folder ` webapp/Assignment2/app_psql `
4. run `npm install` in terminal
5. run application by ` nodemon index.js `

## Deploy Instructions

### Build AMI instance using packer

`packer build -var 'aws_region=us-east-1' centos-ami-template.json `


`chmod 400 dev_pair.pem`
`chmod 400 prod_key.pem`

`ssh -i "dev_pair.pem" centos@ec2-54-208-96-141.compute-1.amazonaws.com`

### CENTOS
##### dev: ami-9887c6e7
##### prod: ami-e0eac385 

### Additional commands to manually setup database in EC2 instance

`sudo systemctl start httpd`

`sudo systemctl status httpd`

`mkdir ccwebapp`

`sudo chmod 777 ccwebapp`

`sudo yum install unzip -y`
`sudo yum install curl`
`curl -O https://bootstrap.pypa.io/get-pip.py`
`python get-pip.py --user`
`sudo vi .bash_profile`
- Write the command in bash_profile
`export PATH=~/.local/bin:$PATH` 

` source .bash_profile `

`pip install awscli --upgrade --user`
#### Configure aws profile of dev/prod
- ` aws configure `
ID/keys of dev/prod

### Change IAM credentials in .env file present in ccwebapp

- Path - `cd ccwebapp/ccwebapp/webapp/app_psql`
`ls -a`- to show the hidden .env file

- Change the IAM ID, Secret Key and bucket name

### change the .tfvar file in terraform/SecurityGroup

- Enter VPC_NAME
- BUCKET_NAME
- KEY_NAME
- AMI_ID
- REGION

## Running Tests
1. Open terminal goto the folder that has `webapp/Assignment2/app_psql` then run the command `npm run test`.

## CI/CD

## Libraries used:
#### For Server:
1. bcryptjs
2. chai
3. chai-http
4. email-check
5. email-validator
6. express
7. nodemon
8. password-validator
9. pg
10. save
11. mocha
12. should
13. superters