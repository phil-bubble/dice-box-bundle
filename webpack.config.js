const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/entry.js',
  output: {
    filename: 'dice-box.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'DiceBox',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/ammo/[name][ext]'
        }
      }
    ]
  },
  experiments: {
    asyncWebAssembly: true
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'node_modules/@3d-dice/dice-box/dist/assets',
          to: 'assets'
        },
        {
          from: '_headers',
          to: '_headers'
        },
        {
          from: '_mime.types',
          to: '_mime.types'
        },
        {
          from: 'CNAME',
          to: 'CNAME'
        }
      ]
    })
  ]
};
