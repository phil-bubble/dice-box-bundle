const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
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
    publicPath: 'auto',
    clean: true
  },
  optimization: {
    minimize: false
  },
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true
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
        type: "asset/resource"
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'node_modules/@3d-dice/dice-box/dist/assets',
          to: 'assets',
          globOptions: {
            ignore: ['**/*.js']
          }
        },
        {
          from: 'node_modules/@3d-dice/dice-themes/themes',
          to: 'assets/themes'
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.wasm']
  }
}
