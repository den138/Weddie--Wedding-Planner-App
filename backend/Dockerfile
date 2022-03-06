FROM node:14.18-stretch

WORKDIR /usr/src/app

COPY package.json .

RUN yarn install

EXPOSE 8080

COPY . .

CMD node index.js
