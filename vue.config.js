const webpack = require('webpack');
const config = require('./package.json')

module.exports = {
  publicPath: "",
  css: { extract: false },
  outputDir: process.env.NODE_ENV === "DEMO" ? "demo/" : "dist/",
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VERSION__:JSON.stringify(config.version)
      })
    ]
  }
};
