const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  // polyfill for async await
  entry: [
    'babel-polyfill', './src/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        // presets: ['react', 'es2015', 'stage-1']
        // state-0 for async await
        presets: ['react', 'es2015', 'stage-0']
      }
    }]
    // for react-day-picker !!!!!!!!!!! Decided to use just a link tag in index.html
    //to import css from unpkg
    // rules: [
    //   {
    //     test: /\.css$/,
    //     use: ['style-loader', 'css-loader']
    //     // loader: 'style-loader!css-loader'
    //   }
    // ]
      // for react-day-picker
  },
  // added resolve .css and root: __dirname for react-day-picker
  resolve: {
    extensions: ['', '.js', '.jsx']
    // root: __dirname
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new Dotenv()
  ]
};
