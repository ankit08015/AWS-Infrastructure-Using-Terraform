
# Infrastructure as Code

## 2. Infrastructure as Code with Terraform

### Run following commands:

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