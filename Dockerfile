# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.16.0
FROM node:${NODE_VERSION}-slim as base
RUN npm install -g npm@9.6.5
LABEL fly_launch_runtime="NodeJS/Prisma"

# NodeJS/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ARG YARN_VERSION=1.22.17
#RUN npm install -g yarn@$YARN_VERSION


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential openssl 

# Install node modules
COPY --link package.json yarn.lock .
RUN yarn install --production=false

# Generate Prisma Client
COPY --link prisma .
RUN npx prisma generate

# Copy application code
COPY --link . .

# Remove development dependencies
RUN yarn install --production=true


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Entrypoint prepares the database.
ENTRYPOINT ["/app/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
CMD [ "yarn", "run", "start" ]
