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

- Give the access to run the command ` chmod +x /path/to/yourscript.sh ` to both setup and teardown script

- Run the ` infrastructure/aws/csye6225-aws-networking-setup.sh ` to create and configure required networking resources using AWS CLI

- Run the ` infrastructure/aws/ csye6225-aws-networking-teardown.sh ` to delete networking resources using AWS CLI

