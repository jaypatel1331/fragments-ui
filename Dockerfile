#fragments-ui-testing-web-app

#stage 1: dependencies
FROM node:18.13.0-alpine@sha256:fda98168118e5a8f4269efca4101ee51dd5c75c0fe56d8eb6fad80455c2f5827  as dependencies


LABEL maintainer="Jay Patel <japatel31@myseneca.ca>"
LABEL description="Fragments UI testing web app"


# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn
# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Use /app as our working directory
WORKDIR /app

# Copy our package.json/package-lock.json in
COPY package* .

# Install node dependencies defined in package.json and package-lock.json for producton
RUN npm ci --only=production

#*************************************************************************************************
#stage 2: build
FROM node:18.13.0-alpine@sha256:fda98168118e5a8f4269efca4101ee51dd5c75c0fe56d8eb6fad80455c2f5827 as build

#use /app as our working directory
WORKDIR /app

#copy node_modules from dependencies stage
COPY --from=dependencies /app/ /app/

#copy everything else into /app
COPY . .

# Run the server
CMD ["npm", "build"]

# We default to use port 1234
EXPOSE 1234


#*************************************************************************************************
#stage 3: production
FROM nginx:stable-alpine as production

#copy everything we need to run
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/.parcel-cache /usr/share/nginx/html

# run server on port 80
EXPOSE 80