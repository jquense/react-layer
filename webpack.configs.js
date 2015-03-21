var webpack = require('webpack');
var pkg = require('./package.json')
var config = pkg.babel

var loaders = [
      { test: /\.css$/,  loader: "style-loader!css-loader" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      { 
        test: /\.jsx$|\.js$/, 
        loader: 'babel-loader', 
        exclude: /node_modules/,
        query: config
      }
    ];


module.exports = {

  dev: {
    devtool: 'source-map',
    
    cache: true,

    entry: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './dev/dev.jsx'
    ],

    output: {
      filename: 'bundle.js',
      path: __dirname
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],

    resolve: {
      extensions: ['', '.js', '.jsx']
    },

    module: {
      loaders: loadersWithHotModule(),
    }
  },

  test: {
    devtool: 'inline-source-map',
    cache: true,
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: loaders.concat(
        { test: /sinon-chai/, loader: "imports?define=>false" })
    }
  }
}

function loadersWithHotModule(){
  return loaders.reduce(function (current, next, idx){
      if(next.loader === 'babel-loader')
        current.push({ test: /\.jsx$|\.js$/, loader: 'react-hot-loader', exclude: /node_modules/ }) 

      return current.concat(next);
  }, [])
}