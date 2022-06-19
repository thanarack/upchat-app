FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production

# Bundle app source
COPY . .

EXPOSE 4000
CMD [ "node", "src/index.js" ]