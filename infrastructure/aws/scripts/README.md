# Infrastructure as Code

## 1. Infrastructure as Code with AWS Command Line Interface¶

### Run following commands:

- open Terminal
- ` ls -a ` will list all the files at root folder
- ` cd .aws ` will open the hidden aws folder
- It will have two folder named as credentials and config
- run ` aws config `

    AWS Access Key ID [None]: ********
    
    AWS Secret Access Key [None]: **********
    
    Default region name [None]: us-east-1 
    
    Default output format [None]: json
- run ` aws config --profile dev`

    AWS Access Key ID [None]: ********
    
    AWS Secret Access Key [None]: **********
    
    Default region name [None]: us-east-1 
    
    Default output format [None]: json

- run ` aws config --profile prod`

    AWS Access Key ID [None]: ********
    
    AWS Secret Access Key [None]: **********
    
    Default region name [None]: us-east-2
    
    Default output format [None]: json

- run ` export AWS_PROFILE=dev ` for exporting dev aws environment variables

                        or

- run ` export AWS_PROFILE=prod ` for exporting prod aws environment variables

- Run the ` sh csye6225-aws-networking-setup.sh <AWS_REGION> <VPC_NAME> <VPC_CIDR_BLOCK>` to create and configure required networking resources using AWS CLI

- Run the ` sh csye6225-aws-networking-teardown.sh <VPC_NAME>` to delete networking resources using AWS CLI

    e.g. ` sh csye6225-aws-networking-setup.sh us-east-1 aj 10.0.0.0/16`

NOTE : DO CHECK THE AWS CONFIGURE AND THE REGION THAT YOU ARE TRAVERSING
- dev --> us-east-1
- prod --> us-east-2