const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

// reference for babel and polyfill; async await
// https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined

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
    },
    // **********for importing png https://blog.hellojs.org/importing-images-in-react-c76f0dfcb552
    //https://stackoverflow.com/questions/35568114/cannot-load-png-files-with-webpack-unexpected-character/35568830#35568830
    // use either url loader or file-loader; file loader good for production so use
    {
      test: /\.(jpg|png|svg)$/,
      loader: 'file-loader',
      options: {
        // regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/,
        name: '[path][name].[hash].[ext]',
      },
    }
    // **********
    ] // end of loaders
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
  }, // end of module
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
