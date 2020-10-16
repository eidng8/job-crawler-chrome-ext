/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

// Webpack cannot be upgraded to v5 unless the following issue were solved:
// https://github.com/jantimon/html-webpack-plugin/issues/1501
const webpack = require('webpack'),
  path = require('path'),
  env = require('./utils/env'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  WriteFilePlugin = require('write-file-webpack-plugin');

const media = [
  'jpe?g',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff2?',
].join('|');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    background: path.join(__dirname, 'src', 'js', 'background.ts'),
    popup: path.join(__dirname, 'src', 'js', 'popup.ts'),
    options: path.join(__dirname, 'src', 'js', 'options.js'),
    content: path.join(__dirname, 'src', 'js', 'content.ts'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
      {
        test: new RegExp(`\\.(${media})$`, 'i'),
        loader: 'file-loader',
        options: { name: '[name].[ext]' },
        exclude: /node_modules/,
      },
      {
        test: /\.html?$/i,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json',
        transform: content => {
          // generates the manifest file using the package.json information
          return Buffer.from(
            JSON.stringify({
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            })
          );
        },
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'options.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'background.html'),
      filename: 'background.html',
      chunks: ['background'],
    }),
    new WriteFilePlugin(),
    new webpack.ProgressPlugin({
      // activeModules: true,
      entries: true,
      modules: true,
      // dependencies: true,
      // percentBy: 'entries',
    }),
  ],
  stats: 'normal',
  devtool:
    'development' == env.NODE_ENV ? 'cheap-module-eval-source-map' : false,
};
