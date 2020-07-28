'use strict'
const path = require('path')

const SourceMap = () => {
  let isSourceMap = true;
  if (process["env"].XA_ENV == "production" || process["env"].XA_ENV == "prod") {
    isSourceMap = false;
  }
  return isSourceMap
}

module.exports = {
  source() {
    let isSourceMap = false;
    if (process["env"].XA_ENV == "production" || process["env"].XA_ENV == "prod") {
      isSourceMap = true;
    }
    return isSourceMap
  },
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        // proxy all requests starting with /api to jsonplaceholder
        '/api': {
            target: 'http://dev.in-hope.com.cn',
            changeOrigin: true,
            // pathRewrite: {
            //    '^/api': ''
            // }
        }
    },
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8081, // can be overwritten by process.env.HOST, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    useEslint: true,
    showEslintErrorsInOverlay: false,
    devtool: 'eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },

  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: SourceMap(),
    devtool: '#source-map',
    productionGzip: true,
    productionGzipExtensions: ['js', 'css', 'png', 'jpg'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
