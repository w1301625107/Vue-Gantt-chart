/**
 * prod 
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
//webpack4 推荐使用MiniCssExtractPlugin来处理css
//const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');


function assetsPath(_path) {
  return path.join(__dirname, '../dist/', _path)
}

function rootDir(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = env => {
  let config = {

    mode: 'production',
  
    entry: rootDir('src/main.js'),
    //entry: ['./src/app.js', './src/main.scss'],
  
    output: {
      path: rootDir('dist'),
      // filename: "bundle.js",
      filename: '[name].[hash].js'
      // assetsSubDirectory:'static',
      //   assetsPublicPath: '/',
      //publicPath: website.publicPath
      //chunkFilename:'[name].chunk.js',
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
        //开发环境不用MiniCssExtractPlugin
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
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
      extensions: [ '.mjs', '.js', '.json', '.vue'], //自动解析确定的扩展
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@views': rootDir('src/views'),
      },
    },
  
    plugins: [
      new HtmlWebpackPlugin({
        template: rootDir('index.html'),
        filename: assetsPath('index.html'),
      }),
      new webpack.DefinePlugin({
        'ENVIRONMENT': '"PROD"'
      }),
      // new webpack.HotModuleReplacementPlugin(), //热加载插件
      new VueLoaderPlugin(''),
      //new ExtractTextPlugin("css/index.css"),
      new MiniCssExtractPlugin({
        filename: 'css/index.css',
      }),
      new copyWebpackPlugin([{
        from: rootDir('static'),
        to:rootDir('dist/static')
      }]),
      new CleanWebpackPlugin(['dist'], {
        root: rootDir(''),
        verbose: true,
        dry: false
      }),
      new CompressionWebpackPlugin({ //gzip 压缩
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
            '\\.(js|css)$'    //压缩 js 与 css
        ),
        threshold: 10240,
        minRatio: 0.8
    })
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

  if(env.analyzer){
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    config.plugins.push(new BundleAnalyzerPlugin())
  }

  return config
} 