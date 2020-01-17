FROM node:dubnium as build-deps
WORKDIR /code
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM alpine:latest
WORKDIR /code/static
COPY --from=build-deps /code/build /code/static/
