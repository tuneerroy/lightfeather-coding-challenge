# pull image
FROM node:18-alpine

# set working directory
WORKDIR /frontend

# install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# add app
COPY . .

# expose port
EXPOSE 3000

# start app
CMD ["npm", "start"]   