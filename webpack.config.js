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
    clean: true
  },
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true
  },
  module: {
    rules: [
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
          from: "node_modules/@3d-dice/dice-box/dist/assets",
          to: "assets"
        },
        {
          from: "_headers",
          to: "_headers"
        }
      ]
    })
  ]
};
