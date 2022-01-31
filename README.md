
## Image Resizer AWS Lambda 입니다
이 프로젝트를 실행시키려면 개인 AWS Lambda, AWS S3가 있어야 합니다

## CircleCI와 Docker로 빌드 자동화가 되어있습니다

### 빌드용 도커 환경설정 방법

```bash
docker run -it amazonlinux:latest /bin/bash

yum upgrade  
yum update  
yum install -y gcc-c++ make  
  
curl -sL https://rpm.nodesource.com/setup_12.x | bash -  
yum install -y nodejs  
npm install -g serverless  
npm install web3 --unsafe-perm=true --allow-root  

serverless config credentials --provider aws --key key입력 --secret secret입력  
```

* .circleci/config.yml을 이 Git Repository와 연결된 CircleCI 에서 읽어서 빌드 & 배포합니다

### AWS 환경변수 셋팅
* AWS Lambda 배포 후 Lambda함수 환경변수 설정에서  
* access(aws access key), secret(aws secret key),  
* bucket(aws S3 bucket), redirect(aws S3 접근 uri)를 반드시 입력해야  
* 이 프로젝트 process.env에서 환경변수를 입력해 동작 가능  

### Local test
* serverless-offline가 설치되어 있으므로  
* 로컬에서 process.env의 환경변수 셋팅 후  
* sls offline start명령어를 입력하면 Local에서 Lambda를 띄우고 테스트를 할 수 있습니다
