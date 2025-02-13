const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dice-box.bundle.js',
    library: {
      name: 'DiceBox',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this',
    clean: true,
    publicPath: 'https://phil-bubble.github.io/dice-box-bundle/'
  },
  optimization: {
    minimize: false
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
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'node_modules/@3d-dice/dice-box/dist/assets',
          to: 'assets',
          globOptions: {
            ignore: ['**/*.wasm']  // Don't copy WASM files, they're handled by the module rule
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
  },
  experiments: {
    asyncWebAssembly: true
  }
}
