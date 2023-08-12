FROM node:latest

LABEL maintainer="krik992@gmail.com"

COPY package.json /usr/

COPY ./app /usr/app/

RUN cd /usr && npm install

WORKDIR /usr/app

EXPOSE 3000

CMD [ "node", "index.js" ]