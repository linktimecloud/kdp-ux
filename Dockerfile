FROM node:18-alpine as build

WORKDIR /app

COPY ./frontend/package.json ./frontend/yarn.lock ./
COPY .yarnrc .

RUN yarn

ENV NODE_ENV=production
COPY ./frontend .

RUN yarn build

# Web
FROM node:18-alpine as release

WORKDIR /app

COPY ./web/package.json ./web/yarn.lock ./
COPY .yarnrc .

RUN yarn

ENV NODE_ENV=production
ENV ENV=production
COPY ./web .

COPY --from=build /app/dist public

EXPOSE 3300
CMD ["npm", "start"]
