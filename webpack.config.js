const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: __dirname,
        exclude: /node_modules/,
        use: {
          loader: 'awesome-typescript-loader',
        },
      },
    ],
  },
};
