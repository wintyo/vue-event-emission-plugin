import * as webpack from 'webpack';
import path from 'path';

export default [
  {
    mode: 'development',
    devtool: 'source-map',
    entry: {
      index: [path.resolve(__dirname, './src/index.ts')],
    },
    output: {
      path: path.resolve(__dirname, './lib'),
      filename: '[name].js',
      library: 'EventEmissionPlugin',
      libraryExport: 'default',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        }
      ]
    },
    resolve: {
      extensions: ['.ts'],
    },
  },
  {
    mode: 'production',
    entry: {
      index: [path.resolve(__dirname, './src/index.ts')],
    },
    output: {
      path: path.resolve(__dirname, './lib'),
      filename: '[name].min.js',
      library: 'EventEmissionPlugin',
      libraryExport: 'default',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        }
      ]
    },
    resolve: {
      extensions: ['.ts'],
    },
  }
] as webpack.Configuration[];
