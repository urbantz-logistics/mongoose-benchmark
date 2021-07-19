FROM node:14.17.3

COPY package.json .
COPY yarn.lock .

RUN yarn install
