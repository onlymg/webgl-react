const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {

  entry: [
    'react-hot-loader/patch',
    './src/index.js'
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs')
  },

  module: {
    rules: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: [ 'babel-loader' ] },
      { test: /\.scss$/, loader: 'style-loader' },
      { test: /\.scss$/, loader: 'css-loader',
        options: { modules: true, camelCase: true }
      },
      { test: /\.scss$/, loader: 'sass-loader'  }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from: './assets/**/*', to: './' }
    ])
  ],

  performance: { hints: false },

  resolve: { extensions: ['*', '.js', '.jsx'] },

  devtool: 'cheap-source-map',

  devServer: { contentBase: './docs', hot: true },

};
