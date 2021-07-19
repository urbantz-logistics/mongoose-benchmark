FROM node:14.17.3
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

CMD ["node", "index.js"]

