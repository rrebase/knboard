# --- Stage 1: Latest LTS Node.js to build the React app
FROM node:12 as build-stage

# Set working directory
WORKDIR /app

# Copy npm package requirements to the workdir
COPY ./frontend/package.json /app/

# Install dependencies into workdir node_modules
RUN yarn install

# Copy the project source code (node_modules not copied, it's in .dockerignore)
COPY ./frontend/ /app/

# Build static files inside the container environment, that will be served by nginx
RUN yarn build

# --- Stage 2: Serve static files with nginx
FROM nginx:1.17

# Copy the React app over from node container to nginx container
COPY --from=build-stage /app/build/ /usr/share/nginx/html

# Copy the nginx configuration files
COPY ./production/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./production/nginx/proxy.conf /etc/nginx/proxy.conf

# Replace underscore variables with env variables
RUN sed -ir "s/__NGINX_DOMAIN_NAME__/${NGINX_DOMAIN_NAME}/g" /etc/nginx/nginx.conf

# Test the configuration file
RUN nginx -c /etc/nginx/nginx.conf -t
