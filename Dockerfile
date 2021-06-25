FROM node:alpine

RUN apk update 

RUN mkdir /app
ADD . /app
WORKDIR /app

COPY package*.json .
# Bundle app source
COPY . ./code

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait

RUN npm install
CMD /wait && npm start
