// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

require('dotenv').config()
console.log(process.env)

module.exports = {
  entry: {
    app: './src/index.tsx',
  },
  output: {
    chunkFilename: '[name].bundle.js',
    filename: '[name].bundle.js',
    path: `${__dirname}/build`,
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](react|react-dom|@material-ui|popper\.js|react|react-redux|prop-types|jss|redux|scheduler|react-transition-group)[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  devServer: {
    // contentBase: './dist', // content not from webpack
    hot: true,
  },
  target: 'web',
  mode: 'production',
  devtool: 'source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json', '.node'],
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          reportFiles: [
            "src/**/*.{ts,tsx}",
            "../backend/src/**/*.{ts,tsx}"
          ]
        }
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },

  devServer: {
    proxy: {
      '/api': 'http://localhost:3001/'
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      __MQTT_URL__: JSON.stringify(process.env.MQTT_URL),
      __MQTT_USER__: JSON.stringify(process.env.MQTT_USER),
      __MQTT_PASS__: JSON.stringify(process.env.MQTT_PASS),
    }),
    new HtmlWebpackPlugin({ template: './index.html', file: './build/index.html', inject: false }),
    new CopyPlugin([
      { from: 'manifest.json' },
      { from: 'icon.png' },
    ]),
    // new BundleAnalyzerPlugin(),
    //new HardSourceWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    // "react": "React",
    // "react-dom": "ReactDOM"
  },
};
