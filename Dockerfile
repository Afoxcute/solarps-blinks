#FROM node:20-alpine as build

# Set the working directory to /app
#WORKDIR /app

# Copy package.json and package-lock.json to the working directory
#COPY package*.json ./

# Install dependencies
#RUN yarn install

# Copy the current directory contents to the container at /app
#COPY . .

# Build the React app
#RUN yarn generate

# Use an official Nginx runtime as a parent image
#FROM nginx:alpine

# Copy the Nginx configuration file
#COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the build stage to the nginx web server directory
#COPY --from=.output/public /app/build /usr/share/nginx/html

# Expose port 3000 or by default port 80 to the outside world
#EXPOSE 3000

# Start Nginx when the container is run
#CMD ["nginx", "-g", "daemon off;"]


# build stage
FROM node:18-alpine as build-stage
WORKDIR /usr/src/app
COPY package*.json ./

RUN apk update
RUN apk add --no-cache git

RUN yarn install 
#--only=prod
COPY . .
RUN yarn start

# production stage
FROM nginx:stable-alpine as production-stage
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /usr/src/app/.output/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
