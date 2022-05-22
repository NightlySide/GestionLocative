############################
# STEP 1 build executable binary
############################

FROM node:alpine AS builder

# Install git.
# Git is required for fetching the dependencies.
RUN apk update && apk add --no-cache tzdata

WORKDIR /app
COPY ./frontend/package.json .
COPY ./frontend/yarn.lock .

# install node modules and build assets
RUN yarn install

# copy whole project
COPY ./frontend .

# create prod build
RUN yarn build

############################
# STEP 2 build a small image
############################
FROM nginx:alpine

# Import from builder
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# Copy our project
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Use an unprivileged user.
ENTRYPOINT ["nginx", "-g", "daemon off;"]