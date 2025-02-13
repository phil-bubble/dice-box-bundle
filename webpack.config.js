const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');

// Read the WASM file
const wasmPath = path.resolve(__dirname, 'node_modules/@3d-dice/dice-box/dist/assets/ammo/ammo.wasm.wasm');
const wasmBinary = fs.readFileSync(wasmPath);
const wasmBase64 = wasmBinary.toString('base64');

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
        }
      ]
    }),
    {
      apply: (compiler) => {
        compiler.hooks.beforeCompile.tap('InjectWASM', () => {
          // Write the WASM loader with the embedded binary
          const wasmLoader = `
// WASM Binary (base64 encoded)
const wasmBase64 = "${wasmBase64}";

// Convert base64 to array buffer
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Export the WASM binary
export const embeddedWasmBinary = base64ToArrayBuffer(wasmBase64);
`;
          
          fs.writeFileSync(
            path.resolve(__dirname, 'src/wasm-loader.js'),
            wasmLoader
          );
        });
      }
    }
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
