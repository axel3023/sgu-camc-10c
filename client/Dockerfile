#Recursos
FROM node:20 alpine AS build

WORKDIR /app

COPY package*json ./

RUN npm install

COPY . .

ARG API_HOST
ARG API_PORT
ARG API_BASE

ENV VITE_API_HOST=$API_HOST
ENV VITE_API_HOST=$API_PORT
ENV VITE_API_BASE=$API_BASE

RUN npm run build

#Imagen

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

cdm ["nginx","-g","daemon off;"]