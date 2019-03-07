/**
 * prod 
 */
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const WebpackBar = require('webpackbar');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');



function assetsPath(_path) {
  return path.join(__dirname, 'dist/', _path)
}

function rootDir(dir) {
  return path.join(__dirname,  dir)
}

module.exports = (env={}) => {
  let config = {

    mode: 'production',

    entry: rootDir('index.js'),

    output: {
      path: rootDir('dist'),
      filename: "bundle.js",
    },

    // 加载器
    module: {
      rules: [{
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          include: [rootDir('src'), rootDir('test')]
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
            loader: "style-loader" // creates style nodes from JS strings
          }, {
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "postcss-loader",
          }, {
            loader: "sass-loader" // compiles Sass to CSS
          }]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: assetsPath('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: assetsPath('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }
      ]
    },
    resolve: {
      extensions: ['.mjs', '.js', '.json', '.vue'], //自动解析确定的扩展
    },

    plugins: [
      new VueLoaderPlugin(''),
      new WebpackBar(),
      new webpack.DefinePlugin({
        'ENVIRONMENT': '"PROD"'
      }),
      new CleanWebpackPlugin(['dist'], {
        root: rootDir(''),
        verbose: true,
        dry: false
      }),
      new webpack.ContextReplacementPlugin(
        /moment[\\\/]locale$/,
        /^\.\/(zh-cn)$/
      ),
    ],
    performance: {
      hints: 'warning'
    },
    optimization: {
      minimizer: [
        new UglifyJSPlugin({
            uglifyOptions: {
                output: {
                    comments: false
                },
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: true
                }
            }
        }),
    ]
  }
}

  if (env.analyzer) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    config.plugins.push(new BundleAnalyzerPlugin())
  }

  return config
}