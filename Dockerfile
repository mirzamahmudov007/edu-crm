FROM node:20-alpine3.20 AS build

WORKDIR /usr/src/app

RUN apk add --no-cache bash

# Paketlar va lock faylni ko‘chirish
COPY package*.json ./

# Faqat production dependencies o‘rnatish
RUN npm install --legacy-peer-deps --force

# Loyihani ko‘chirish
COPY . .

# React loyihani build qilish
RUN npm run build

##############################
###  PRODUCTION ENVIRONMENT ###
##############################
FROM nginx:stable-alpine AS production

# Nginx konfiguratsiyasini nusxalash
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Build qilingan fayllarni nusxalash
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# 80-portni ochish
EXPOSE 80

# Nginx ishga tushirish
ENTRYPOINT ["nginx", "-g", "daemon off;"]