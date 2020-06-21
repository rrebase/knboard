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
