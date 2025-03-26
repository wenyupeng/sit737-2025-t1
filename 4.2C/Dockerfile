FROM node:14-alpine

WORKDIR /usr/src/app

# copy application code to the working directory
COPY . .

# install dependencies
RUN npm install

EXPOSE 3000

# change owner of the working directory to node user
RUN chown -R node:node /usr/src/app

# set the user to node
USER node

CMD ["node", "server.js"]