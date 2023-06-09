#!/bin/bash
FROM node:16

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . /app

RUN npm run build
EXPOSE 3000

ENTRYPOINT [ "npm",  "run",  "start" ]