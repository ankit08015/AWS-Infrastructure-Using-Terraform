
# Infrastructure as Code

## 2. Infrastructure as Code with Terraform

### Run following commands:

##### Install Terraform

- Install unzip

     ` sudo apt-get install unzip `
- Install Terraform 
 ` wget https://releases.hashicorp.com/terraform/0.12.7/terraform_0.12.9_linux_amd64.zip `

- Extract the downloaded file archive

  `unzip terraform_0.12.9_linux_amd64.zip `

- Move the executable into a directory searched for executables

  ` sudo mv terraform /usr/local/bin/ `

- Run it to check version

` terraform --version ` 

- open Terminal
` ls -a ` 

- ` terraform init ` - to initialize terraform in the particular folder

- ` aws configure ` - to get the Access Key ID and Secret Access Key

- ` terraform plan ` - to get the setup for terraform apply

- ` terraform apply `- to generate the plan and create whatever is to be created

- ` terraform apply -var-file ` - to apply a varaibles file

- ` terraform apply -var = ` - to apply variables to a file at runtime

- ` terraform destroy ` - to destroy or get rid of something

- For giving the variables give values in ` /terraform/Networking/csye6225.tfvars file `.
- To run the variable file : ` terraform apply -var-file="csye6225.tfvars" `

NOTE : DO CHECK THE AWS CONFIGURE AND THE REGION THAT YOU ARE TRAVERSING
- dev --> us-east-1
- prod --> us-east-2