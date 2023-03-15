const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({

  transpileDependencies: false,
  configureWebpack: {
    externals: {
      'electron': 'require("electron")'
    },
  },
  // devServer: {
  //   host: "localhost",
  //   port: 8080,
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:5001", 
  //       changOrigin: true, 
  //       ws: true, 
  //       pathRewrite: {
  //         "^/api": "/",
  //       },
  //     },
  //   },
  // },
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: "./",
      builderOptions: {
        extraResources: {
          from: './backendist',
          to: './'
        },
        asar: false,
        appId: 'test.com',
        win: {
          icon: 'public/win.png'
        }
      }
    }
  }

})
