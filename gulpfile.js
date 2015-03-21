'use strict';
var gulp    = require('gulp')
  , rimraf  = require('rimraf')
  , plumber = require('gulp-plumber')
  , babel   = require('./package.json').babel
  , configs = require('./webpack.configs')
  , babelTransform = require('gulp-babel-helpers')
  , webpack = require('webpack')
  , WebpackDevServer = require("webpack-dev-server");


gulp.task('clean', function(cb){
  rimraf('./lib', cb);
})



gulp.task('transpile', ['clean'], function(){

  return gulp.src(['./src/**/*.jsx', './src/**/*.js'])
      .pipe(plumber())
      .pipe(babelTransform(
          babel
        , './util/babelHelpers.js'
        , './lib/util/babelHelpers.js'))
      .pipe(gulp.dest('./lib'));
})

gulp.task('dev', function() {

  new WebpackDevServer(webpack(configs.dev), {
    publicPath: "/dev",
    hot: true,
    stats: { colors: true }
  })
  .listen(8080, 'localhost', function (err, result) {
    if (err) 
      return console.log(err);
    
    console.log('Listening at localhost:8080');
  });

})

gulp.task('release', ['clean', 'transpile'])