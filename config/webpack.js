// Use sails-hook-webpack
// Ref. https://github.com/teamfa/sails-hook-webpack

var webpack = require('webpack');
var path = require('path');
var LessPluginCleanCSS = require('less-plugin-clean-css');

var debug = process.env.NODE_ENV === 'development';
var entry = [
  path.resolve(__dirname, '../assets/main.js') // set your main javascript file
];
var plugins = [
  // prevents the inclusion of duplicate code into your bundle
  new webpack.optimize.DedupePlugin()
];

if (debug) {
  // add this entries in order to enable webpack HMR in browser
  entries.push('webpack/hot/dev-server');
  entries.push('webpack-dev-server/client?http://localhost:3000/');

  // HMR plugin
  plugins.push(new webpack.HotModuleReplacementPlugin({
    multiStep: true
  }));
} else {
  // Minify bundle (javascript and css)
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    output: { comments: false },
    compress: {
      // warnings: false, // when use webpack drop_console is output warning
      // drop_console: true // delete console.*
    }
  }));
}

module.exports.webpack = {
  config: { // webpack config begin here
    devtool: ["eval", "#source-map"],
    entry: entry,
    output: {
      path: path.resolve(__dirname, '../.tmp/public'), // sails.js public path
      filename: 'bundle.js' // or 'bundle-[hash].js'
    },
    debug: debug,
    plugins: plugins,
    module: {
      preLoaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
            presets: ['es2015', "babel-preset-stage-2"]
          }
        },
        {
          test: /.(jpg|jpeg|png|gif|svg)$/, // Minify images using imagemin
          loader: 'image-webpack', // npm install --save image-webpack-loader
          query: {
            bypassOnDebug: true // do not minify when is in development mode
          }
        }
      ],
      loaders: [ // not all are necessary, choose wisely
        {
          test: /\.css$/, // load CSS files
          loaders: [
            'style', // npm install --save style-loader
            'css?root=' + __dirname + '/../assets', // npm install --save css-loader
            'autoprefixer?browsers=last 2 versions' // npm install --save autoprefixer-loader
          ]
        },
        {
          test: /\.less$/, // load LESS files
          loaders: [
            'style',
            'css',
            'autoprefixer?browsers=last 2 versions',
            'less?sourceMap' // npm install --save less-loader less
          ]
        },
        {
          test: /\.png$/, // load PNG using base64 encode
          loader: 'url?limit=100000' // npm install --save url-loader
        },
        {
          test: /\.(jpg|gif)$/, // load image files
          loader: 'file' // npm install --save file-loader
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, // load SVG using base64 encode
          loader: 'url?limit=10000&mimetype=image/svg+xml'
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, // load font files
          loader: 'url?limit=10000&mimetype=application/font-woff'
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, // load TTF font files
          loader: 'url?limit=10000&mimetype=application/octet-stream'
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, // load EOT font files
          loader: 'file'
        }
      ]
    },
    lessLoader: { // config less-loader
      lessPlugins: [
        new LessPluginCleanCSS({advanced: true})
      ]
    },
    imageWebpackLoader: { // config image-webpack-loader
      optimizationLevel: 6, // imagemin options
      progressive: true,
      interlaced: true,
      pngquant: { // pngquant custom options
        quality: '65-90',
        speed: 4
      },
      svgo: { // svgo custom options
        plugins: [
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false }
        ]
      }
    }
  }, // webpack config ends here
  development: { // dev server config
    // webpack: { }, // separate webpack config for the dev server or defaults to the config above
    config: { // webpack-dev-server config
      // This is handy if you are using a html5 router.
      historyApiFallback: true,
      // set value port as 3000,
      // open your browser at http://localhost:3000/ instead of http://localhost:1337/
      // for develop and debug your application
      port: 3000,
      // enable Hot Module Replacement with dev-server
      hot: true,
      // sails.js public path
      contentBase: path.resolve(__dirname, '../.tmp/public'),
      // bypass sails.js server
      proxy: {
        '*': {
          target: 'http://localhost:1337'
        }
      }
    }
  },
  watchOptions: {
    aggregateTimeout: 300
  }
};
