# KDP UX

[English](./README.md) | 简体中文
<br>

## 开发

### 准备

- [nvm](https://github.com/nvm-sh/nvm)
  - 确保安装在`.nvmrc`中指定的node版本，例如 "nvm install --lts=gallium"
  - 运行 `nvm use` 来使用在 `.nvmrc`中指定的node版本，例如 "nvm use --lts=gallium"
  - 或者通过运行 `nvm alias default <version>`将node版本设置为默认
- [yarn](https://yarnpkg.com/)
  - 通过运行 `npm install -g yarn` 来安装yarn

### 安装

- 运行 `cd ./frontend && yarn install` 在 `frontend` 目录中安装依赖项
- 运行 `cd ./web && npm install` 在 `web` 目录中安装依赖项

### Node服务开发

- 打开根目录中的 `setupBackend.sh` 文件，对其中的 mysql、backend service domain 等env参数进行配置
  - 检查 `./web/middlewares/proxy/proxyTable.js`以获取代理配置
- 运行 `bash setupBackend.sh` 来启动node服务
- node服务的源代码在 `./web` 目录中

### 前端开发

- 在 './frontend' 目录中，运行 `npm run dev` 来启动前端代码
- 前端的源代码在 `./frontend` 目录中


## 构建

- 生产环境中，在 './' 目录中，运行 `docker build -t kdp-ux .` 来构建docker镜像
- 本地集成测试环境，在 './' 目录中，运行 `bash build_dev.sh` 来构建node和前端应用程序


## 知识库

### 基础

- [docker](https://www.docker.com/)
- [node](https://nodejs.org/en/)

### Node服务

- [Koa](https://koajs.com/)
- [Others](./web/package.json)

### 前端

- [Vue](https://v2.cn.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Element UI](https://element.eleme.cn/)
- [Others](./frontend/package.json)