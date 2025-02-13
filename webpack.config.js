const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
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
    publicPath: 'auto',
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
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/themes/[path][name][ext]'
        }
      },
      {
        test: /\.json$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/themes/[path][name][ext]'
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
          from: 'node_modules/@3d-dice/dice-themes/themes',
          to: 'assets/themes',
          globOptions: {
            ignore: ['**/.DS_Store'],
          },
        },
        {
          from: 'node_modules/@3d-dice/dice-box/dist/assets/ammo',
          to: 'assets/ammo',
          globOptions: {
            ignore: ['**/.DS_Store'],
          },
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.wasm'],
    fallback: {
      fs: false,
      path: false,
      crypto: false
    }
  },
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true
  }
};
