FROM amazonlinux:2.0.20210326.0

RUN yum upgrade -y && yum update && yum install -y gcc-c++ make && yum install -y git
RUN curl -sL https://rpm.nodesource.com/setup_12.x | bash -  
RUN yum install -y nodejs && npm install -g serverless && npm install web3 --unsafe-perm=true --allow-root

RUN serverless config credentials --provider aws --key <ACCESS_KEY> --secret <SECRET_KEY>
