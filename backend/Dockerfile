# pull image
FROM node:18-alpine

# set working directory
WORKDIR /backend

# install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# add app
COPY . .

# expose port
EXPOSE 8080

# start app
CMD ["node", "src/server.js"]