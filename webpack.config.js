const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const fs = require('fs');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
    new InjectManifest({
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js',
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 5000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/server.cert')),
    },
    allowedHosts: ['0.0.0.0'],
  },
};
