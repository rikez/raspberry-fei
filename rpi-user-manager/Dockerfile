# Build
FROM node:10-stretch-slim AS dependencies

WORKDIR /app
COPY package*.json ./
RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y ca-certificates && update-ca-certificates && \
    apt-get install -y tzdata && \
    apt-get install -y git && \
    apt-get install -y make && \
    apt-get install -y g++ && \
    apt-get install -y python

RUN npm install --only=production

# Release
FROM node:10-stretch-slim AS release

WORKDIR /usr/bin/rpi-user-manager/

COPY . .
COPY --from=dependencies  /app/node_modules ./node_modules/

RUN apt-get update -y && \
    apt-get install -y tzdata && \
    apt-get install -y ca-certificates && update-ca-certificates

CMD ["node", "/usr/bin/rpi-user-manager/bin/index.js"]
