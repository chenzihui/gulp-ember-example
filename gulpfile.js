'use strict';

var gulp       = require('gulp'),

    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    declare    = require('gulp-declare'),
    wrap       = require('gulp-wrap'),
    handlebars = require('gulp-handlebars'),
    webserver  = require('gulp-webserver'),

    del        = require('del'),

    paths;

paths = {
  build: './build/**/*',
  buildJS: './build/js',

  src: './src/**/*',

  vendorJS: [
    './vendor/jquery/dist/jquery.js', './vendor/handlebars/handlebars.js',
    './vendor/ember/ember.js', './vendor/ember-data/ember-data.js'
  ],
  appJS: './src/js/**/*.js',

  html: './src/index.html',
  templates: './src/templates/**/*.hbs'
};


// Utilities
// ------------------------------

gulp.task('clean', function(done) {
  del([paths.build], done);
});

gulp.task('server', function() {
  gulp.src('./build/')
    .pipe(webserver({
      port: 4000
    }));
});


// Javascript
// ------------------------------

function buildScripts(path, name) {
  return gulp.src(path)
    .pipe(uglify())
    .pipe(concat(name))
    .pipe(gulp.dest(paths.buildJS));
}

gulp.task('js:vendor', ['clean'], function() {
  return buildScripts(paths.vendorJS, 'vendor.js');
});

gulp.task('js:app', ['clean'], function() {
  return buildScripts(paths.appJS, 'app.js');
});

gulp.task('js', ['js:vendor', 'js:app']);


// Templates
// ------------------------------

function buildTemplates() {
  return gulp.src(paths.templates)
    .pipe(handlebars({
      handlebars: require('ember-handlebars')
    }))
    .pipe(wrap('Ember.Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Ember.TEMPLATES',
      noRedeclare: true,
      processName: function(path) {
        var path = path.replace('src/templates/', ''),
            name = declare.processNameByPath(path);

        return name.split('.').join('/')
      }
    }))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(paths.buildJS));
}

gulp.task('html', ['clean'], function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest('./build/'));
});

gulp.task('templates', ['clean'], function() {
  return buildTemplates();
});


// Watchers
// ------------------------------

gulp.task('watch', function() {
  gulp.watch(paths.src, ['build']);
});


// Tasks
// ------------------------------

gulp.task('build', ['html', 'js', 'templates']);

gulp.task('default', ['build']);
gulp.task('dev', ['build', 'server', 'watch']);
