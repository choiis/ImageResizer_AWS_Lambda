
## Image Resizer AWS Lambda
* You must have your own AWS Lambda, AWS S3 to run this project

### AWS environment variable setting
* After deploying AWS Lambda, in the Lambda function environment variable setting
* access(aws access key), secret(aws secret key),
* bucket(aws S3 bucket), redirect(aws S3 access uri),
* message and phone(phone number to receive sns)  must be entered on AWS console.
* Can be operated by inputting environment variables in process.env of this project

### AWS diagram
![AWS](http://imageresizer-dev-serverlessdeploymentbucket-xapz1q6q9exe.s3-website-ap-northeast-1.amazonaws.com/gitpng/lambda_diagram_v1.png)

## Build automation with CircleCI and Docker

### How to configure docker configuration for build

* See the Dockerfile in this repository or the bash script below

```bash
docker run -it amazonlinux:2.0.20251110.1 /bin/bash

yum upgrade -y
yum update -y
yum install -y gcc-c++ make  
  
curl -sL https://rpm.nodesource.com/setup_18.x | bash -  
dnf install nodejs -y
yum install -y nodejs  
npm install -g serverless  
npm install -g npm@11.6.4
npm install web3 --unsafe-perm=true --allow-root  

yum install git -y

serverless config credentials --provider aws --key <ACCESS_KEY> --secret <SECRET_KEY>
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