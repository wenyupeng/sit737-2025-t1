FROM node:22

WORKDIR /app

COPY ../src/package*.json ./
COPY . .

RUN npm install
CMD [ "node","server.js" ]
