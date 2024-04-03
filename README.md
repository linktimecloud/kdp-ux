# KDP UX

English | [简体中文](./README_CN.md)
<br>

## Development

### Preparation

- [nvm](https://github.com/nvm-sh/nvm)
  - Ensure the node version specified in `.nvmrc` is installed, for example "nvm install --lts=gallium"
  - Run `nvm use` to use the node version specified in `.nvmrc`, for example "nvm use --lts=gallium"
  - Or set the node version as default by running `nvm alias default <version>`
- [yarn](https://yarnpkg.com/)
  - Install yarn by running `npm install -g yarn`

### Installation

- Run `cd ./frontend && yarn install` to install dependencies in `frontend` directory
- Run `cd ./web && npm install` to install dependencies in `web` directory

### Node Service Development

- Open `setupBackend.sh` file in root directory and configure the env parameters such as mysql, backend service domain etc.
  - Check `./web/middlewares/proxy/proxyTable.js` for proxy configuration
- Run `bash setupBackend.sh` to start the node service
- The source code of node service is in `./web` directory

### Front-end Development

- In './frontend' directory, run `npm run dev` to start the frontend code
- The frontend source code is in `./frontend` directory


## Build

- In production, in './' directory, run `docker build -t kdp-ux .` to build docker image
- For local integration testing environment, in './' directory, run `bash build_dev.sh` to build node and frontend applications


## Knowledge Base

### Basics

- [docker](https://www.docker.com/)
- [node](https://nodejs.org/en/)

### Node Service

- [Koa](https://koajs.com/)
- [Others](./web/package.json)

### Front-end

- [Vue](https://v2.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Element UI](https://element.eleme.io/)
- [Others](./frontend/package.json)