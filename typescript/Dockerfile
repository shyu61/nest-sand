FROM node:17-alpine3.15

WORKDIR /app/packages

COPY ./typescript/ .
COPY ./proto ../proto

RUN yarn install

CMD ["yarn", "start"]
