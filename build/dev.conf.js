/**
 * dev
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function assetsPath(_path) {
  return path.join(__dirname, '../dist/', _path)
}

function rootDir(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  mode: 'development',

  devtool: 'eval-source-map',

  entry: rootDir('src/main.js'),

  output: {
    path: rootDir('dist'),
    filename: '[name].[hash].js'
  },


  devServer: {
    //clientLogLevel: 'warning',
    //historyApiFallback:true,
    host: '127.0.0.1',
    hot: true,
    contentBase: rootDir(''),
    //compress: true,
    //open: true,
    overlay: true,
    // publicPath: 'static',
    //quiet: true, // necessary for FriendlyErrorsPlugin
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
        use: [{
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
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@views': rootDir('src/views'),
      '@src': rootDir('src')
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: rootDir('index.html'),
      filename: assetsPath('index.html'),
    }),
    new webpack.DefinePlugin({
      __DEV__: true
    }),
    new webpack.HotModuleReplacementPlugin(), //热加载插件
    new VueLoaderPlugin(''),
  ],
  performance: {
    hints: 'warning'
  },

  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    }
  }
}