
# Infrastructure as Code


## Infrastructure as Code with Terraform

### Run following commands:

#### A- Install Terraform

- Install unzip

     ` sudo apt-get install unzip `
- Install Terraform 
 ` wget https://releases.hashicorp.com/terraform/0.12.10/terraform_0.12.10_linux_amd64.zip `

 Note- If you get error in this step change the version to current one

- Extract the downloaded file archive

  `unzip terraform_0.12.9_linux_amd64.zip `

- Move the executable into a directory searched for executables

  ` sudo mv terraform /usr/local/bin/ `

- Run it to check version

     `terraform --version `

#### B- Create infrastructure using terraform

- open Terminal and go to `/ccwebapp/infrastructure/aws/terraform/Networking` folder

- ` terraform init ` - to initialize terraform. Need to run only once

- ` terraform plan ` - to get the setup for terraform apply. Need to run only once.

- Give the variables values in `csye6225.tfvars` file.

- To run the variable file : ` terraform apply -var-file="csye6225.tfvars" `

- ` terraform destroy ` - to destroy the infrastructure created

  ` terraform destroy -var-file="csye6225.tfvars" ` - to delete with the var file that you is created

#### Additional terraform commands

- ` terraform apply `- to generate the plan and create infrastructure with default values

- ` terraform apply -var-file ` - to apply a varaibles file

- ` terraform apply -var = ` - to apply variables to a file at runtime

NOTE : DO CHECK THE AWS CONFIGURE AND THE REGION THAT YOU ARE TRAVERSING
- dev --> us-east-1
- prod --> us-east-2