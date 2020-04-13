const webpack = require('webpack')
const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // extract css in file

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production'
  console.log('devMode: ', devMode)

  // constant define the modules used to process the css
  // - postcss-loader to add prefixer for browsers compatibility
  // - css-loader to understand css with webpack
  // - MiniCssExtractPlugin to extract final css in file or style-loader to inject in html directly in dev
  const cssLoaders = [
      devMode ? 'style-loader' : // fallback to style-loader in development
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: devMode, // only enable hot reload in development
        reloadAll: true // if hmr does not work, this is a forceful method
      }
    },
    {
      loader: 'css-loader',
      options: { sourceMap: devMode } // for dev debug
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: devMode, // for dev debug
        ident: 'postcss',
        plugins: (loader) => [ require('autoprefixer')()] // auto prefix css for web browsers compatibility
      }
    }
  ]

  const config = {
    entry: [path.resolve(__dirname, './src/index.js')],  
    devtool: 'source-map', // for dev debug
    watch: devMode, // for update
    output: {
      path: path.resolve(__dirname, './out'),
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: path.resolve(__dirname, './out'),
      port: 3000
    },
    module: {
      rules: [
        { // for syntaxe check
          enforce: "pre",
          test: /(\.jsx|\.js)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        },
        { // for  web browsers compatibility
          test: /(\.jsx|\.js)$/,
          loader: 'babel-loader',
          exclude: /(node_modules)/
        },
        { // for css
          test: /\.css$/i,
          use: cssLoaders
        },
        { // for sass
          test: /\.s[ac]ss$/i,
          use: [
            ...cssLoaders,
            {
              loader: 'sass-loader',
              options: { sourceMap: devMode } // for dev debug
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "src/index.html",
        filename: "index.html"
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
      })
    ]
  }
  return config
}