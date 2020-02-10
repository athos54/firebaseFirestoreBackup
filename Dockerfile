FROM ubuntu:latest

#INSTALL GCLOUD
RUN apt update -y
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
RUN apt-get install apt-transport-https ca-certificates gnupg npm curl wget -y
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
RUN apt-get update -y 
RUN apt-get install google-cloud-sdk -y

#COPY APP
COPY ./src /app/src

#INSTALL NPM
RUN npm cache clean -f
RUN npm install -g n
RUN n 10.16.3

#INSTALL FIREBASE-TOOLS
RUN npm install -g firebase-tools

WORKDIR /app
COPY ./entrypoint.sh .
RUN [ -d /app/src ] || mkdir /app/src
WORKDIR /app/src
RUN npm i
RUN chmod +x /app/entrypoint.sh
CMD /app/entrypoint.sh

