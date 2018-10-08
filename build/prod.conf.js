/**
 * prod 
 */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
//webpack4 推荐使用MiniCssExtractPlugin来处理css
//const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

function assetsPath(_path) {
  return path.join(__dirname, '../dist/', _path)
}

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// var website = {
//   publicPath: "http://localhost:8080/"
// }



module.exports = {
  mode: 'development',

  devtool: 'eval-source-map',

  entry: resolve('src/main.js'),
  //entry: ['./src/app.js', './src/main.scss'],


  output: {
    path: resolve('dist'),
    filename: "bundle.js",
    //publicPath: website.publicPath
    //chunkFilename:'[name].chunk.js',
  },


  // 加载器
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        // options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [resolve('src'), resolve('test')]
      },
      //开发环境不用MiniCssExtractPlugin
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
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
    extensions: ['.wasm', '.mjs', '.js', '.json', '.vue'], //自动解析确定的扩展
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@views': resolve('src/views'),
      '@src': resolve('src')
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('index.html'),
      filename: assetsPath('index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(), //热加载插件
    new VueLoaderPlugin(''),
    //new ExtractTextPlugin("css/index.css"),
    new MiniCssExtractPlugin({
      filename: 'css/index.css',
    }),
    new CleanWebpackPlugin(['dist'], {
      root: resolve(''),
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
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    }
  }
}