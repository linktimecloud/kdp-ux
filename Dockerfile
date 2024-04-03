FROM node:16-alpine as frontend-build

WORKDIR /app
RUN chown -R 1000:1000 /app

COPY ./frontend/package.json ./
COPY .yarnrc .

RUN yarn install --network-timeout 1000000

ENV NODE_ENV=production
COPY ./frontend .

RUN yarn build

# Web
FROM node:16-alpine as backend

WORKDIR /app

COPY ./web/package*.json ./
COPY ./web/.npmrc ./
RUN npm set progress=false \
  && npm config set depth 0 \
  && npm cache clean --force \
  && npm install --only=production

ENV NODE_ENV=production
COPY --chown=1000:1000 ./web .

COPY --from=frontend-build /app/dist/ ./public

EXPOSE 3300
CMD ["npm", "start"]
