
## Image Resizer AWS Lambda
* You must have your own AWS Lambda, AWS S3 to run this project

### AWS environment variable setting
* After deploying AWS Lambda, in the Lambda function environment variable setting
* access(aws access key), secret(aws secret key),
* bucket(aws S3 bucket), redirect(aws S3 access uri),
* message and phone(phone number to receive sns)  must be entered.
* Can be operated by inputting environment variables in process.env of this project

### AWS diagram
![AWS](http://imageresizer-dev-serverlessdeploymentbucket-xapz1q6q9exe.s3-website-ap-northeast-1.amazonaws.com/gitpng/lambda_diagram_v1.png)

## Build automation with CircleCI and Docker

### How to configure docker configuration for build

```bash
docker run -it amazonlinux:latest /bin/bash

yum upgrade  
yum update  
yum install -y gcc-c++ make  
  
curl -sL https://rpm.nodesource.com/setup_12.x | bash -  
yum install -y nodejs  
npm install -g serverless  
npm install web3 --unsafe-perm=true --allow-root  

serverless config credentials --provider aws --key enter key --secret enter secret
```

* Read .circleci/config.yml from CircleCI connected to this Git Repository and build & deploy

### build and deploy automation diagram
![AWS](http://imageresizer-dev-serverlessdeploymentbucket-xapz1q6q9exe.s3-website-ap-northeast-1.amazonaws.com/gitpng/lambda_build_deploy_v1.PNG)

### local test
* Since serverless-offline is installed
* After setting the environment variable of process.env locally
* If you enter the following command, you can launch Lambda in Local and test it.

```bash
sls offline start
```