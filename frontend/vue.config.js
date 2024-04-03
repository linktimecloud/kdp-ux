const { defineConfig } = require('@vue/cli-service')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isThrift = process.env.BUILD_MODE === 'thrift'
module.exports = defineConfig({
  transpileDependencies: isThrift,
  devServer: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT
  },
  css: {
    extract: {
      ignoreOrder: true
    }
  },
  assetsDir: isProd ? 'static' : '',
  configureWebpack: {
    cache: isProd
      ? false
      : {
          type: 'filesystem',
          allowCollectingMemory: true
        },
    plugins: [
      new StyleLintPlugin({
        files: ['**/*.{vue,css,scss,sass}']
      }),
      new MomentLocalesPlugin({
        localesToKeep: ['en', 'zh-cn']
      })
    ]
  },
  chainWebpack: config => {
    // remove the prefetch plugin
    config.plugins.delete('prefetch')

    config.plugin('html').tap((args) => {
      args[0].title = 'Kubernetes Data Platform'
      return args
    })
  }
})
