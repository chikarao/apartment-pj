const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

const path = require('path');

// reference for babel and polyfill; async await
// https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined
// Reference: migration from webpack 1 to webpack 4 https://webpack-gatsby.netlify.com/how-to/upgrade-from-webpack-1/
// higher level about webpack: https://webpack-gatsby.netlify.com/concepts/
// about polyfills: https://hackernoon.com/polyfills-everything-you-ever-wanted-to-know-or-maybe-a-bit-less-7c8de164e423
// There are 4 major sections: entry, output, loaders, plugins
// resolve taken out https://stackoverflow.com/questions/44518655/webpack-taking-a-long-time-to-build
module.exports = {
  // polyfill for async await
  // mode: 'development',
  // none works optimizes for both production and development
  mode: 'none',
  // turn off watch mode so after initial build, won't watch for changes in js files
  watch: false,
  // entry is the first file to kick off app;
  // polyfill needs to be loaded in the very beginning.
  entry: [
    'babel-polyfill', './src/index.js'
  ],
  // output tells wp how to handle and where to put bundle
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  // to wp, every file is a module, css, js, html, jpg.
  // loaders tell wp how to handle these files as they are added to dependency graph
  module: {
    // file-loader doc: https://github.com/webpack-contrib/file-loader
    // wp4 loaders changed to rules
    rules: [
      {
        // test: /\.(jpg|png|gif|svg)$/i,
        // test: /\.(jpg|png|svg)$/i,
        test: /\.(jpg|png|gif|svg)$/i,
        // wp4 loaders changed to use
        use: [
          {
            loader: 'file-loader',
            // query changed to options in wp4
            options: {
            // regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/,
              name: '[path][name].[hash].[ext]'
              // name: '[path][name].[ext]'
            // context: ''
            }
          }
        ]
      },
      {
        // tell wp if come across file that resolves to js or jsx inside require (import),
        // use babel-loader to transform it before bundling
        test: /\.js?$/,
        exclude: /node_modules/,
        use:
          { loader: 'babel-loader',
        options: {
         presets: ['react', 'es2015', 'stage-0']
         // plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
       }
      }
    }
      // options: {
      //   // presets: ['react', 'es2015', 'stage-1']
      //   // state-0 for async await
      //   presets: ['react', 'es2015', 'stage-0']

    // **********for importing png https://blog.hellojs.org/importing-images-in-react-c76f0dfcb552
    //https://stackoverflow.com/questions/35568114/cannot-load-png-files-with-webpack-unexpected-character/35568830#35568830
    // use either url loader or file-loader; file loader good for production so use
    // **********
    ] // end of loaders !!! now rules
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
  // resolve new in wp4
  // resolve tells wp how to resolve modules in detail
  // reference: https://webpack.js.org/configuration/resolve/

  // resolve: {
  //   extensions: ['*', '.js', '.jsx'],
  //   modules: [
  //    path.join(__dirname, 'src'),
  //    'node_modules'
  //  ],
  //  // test: /\.(jpg|png|svg)$/,
  //  // loader: 'file-loader',
  //  // options: {
  //  //   // regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/,
  //  //   name: '[path][name].[hash].[ext]',
  //  // },
  //   // root: __dirname
  // }, // end of resolve

  // for webpack-dev-server
  // can change port
  devServer: {
    // for 404 responses
    historyApiFallback: true,
    // tell server where to serve content from
    contentBase: './'
  },
  // plugins are for performing functions with chunks in the bundle,
  // os need to require at top nut just per file basis like modules
  // & create instance by new
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new Dotenv()
  ]
};
