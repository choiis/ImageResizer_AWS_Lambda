FROM amazonlinux:2023

RUN yum -y update
RUN yum -y install gcc-c++
RUN yum -y install make
RUN yum -y install git
RUN yum -y install tar
RUN yum -y install gzip
RUN yum -y install which
RUN yum -y install findutils
RUN yum -y install procps-ng
RUN yum -y install util-linux

RUN curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - && \
    yum -y install nodejs && \
    yum clean all

RUN npm install -g serverless

WORKDIR /workspace


CMD ["/bin/bash"]
