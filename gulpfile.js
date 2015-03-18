'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development',
  CLIENT_PORT = process.env.npm_package_config_CLIENT_PORT || 8080,
  API_PORT = process.env.npm_package_config_API_PORT || 8081,
  DISPATCHER_PORT = process.env.npm_package_config_DISPATCHER_PORT || 8082,
  LIVERELOAD = process.env.npm_package_config_LIVERELOAD || true,
  ASSET_URL = process.env.npm_package_config_ASSET_URL || '/',
  IOJS_OPTIONS = ['--harmony_classes', '--use_strict', '--es_staging'],
  IOJS = `iojs ${IOJS_OPTIONS.join(' ')}`,
  MOCHA = 'node_modules/mocha/bin/mocha --harmony',
  JSDOC = 'node_modules/jsdoc/jsdoc.js';

const gameFiles = [
  './game/*.js',
  './game/models/*.js'
], apiFiles = [
  './api/*.js',
  './api/models/*.js'
], dispatcherFiles = [
  './dispatcher/*.js'
], clientFiles = [
  './client/*.js',
  './client/models/*.js',
  './client/scenes/*.js'
], lessFiles = [
  './client/index.less',
  './client/views/*.less'
], jadeFiles = [
  './client/index.jade'
];

const allJSFiles = gameFiles.concat(apiFiles, clientFiles, dispatcherFiles, ['./spec/*.js', './gulpfile.js']);

const gulp = require('gulp'),
  _ = require('underscore'),
  connect = require('gulp-connect'),
  spawn = require('child_process').spawn,
  jade = require('gulp-jade'),
  less = require('gulp-less'),
  jshint = require('gulp-jshint'),
  browserify = require('browserify'),
  vinyl = require('vinyl-source-stream'),
  rename = require('gulp-rename'),
  modRewrite = require('connect-modrewrite'),
  concat = require('gulp-concat'),
  clean = require('gulp-clean'),
  seq = require('run-sequence'),
  exec = require('gulp-exec'),
  babelify = require('babelify'),
  babel = require('gulp-babel'),
  watch = require('gulp-watch');

let apiService, dispatcherService;

gulp.task('api:start', function () {
  if (apiService) { apiService.kill(); }
  apiService = spawn('iojs', IOJS_OPTIONS.concat(['api/index.js']), {
    stdio: 'inherit',
    env: {
      NODE_ENV: NODE_ENV,
      API_PORT: API_PORT,
      PATH: process.env.PATH
    }
  }).on('error', function (err) {
    throw err;
  });
  apiService.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('dispatcher:start', function () {
  if (dispatcherService) {
    dispatcherService.kill();
  }
  dispatcherService = spawn('iojs', IOJS_OPTIONS.concat(['dispatcher/index.js']), {
    stdio: 'inherit',
    env: {
      NODE_ENV: NODE_ENV,
      API_PORT: API_PORT,
      DISPATCHER_PORT: DISPATCHER_PORT,
      PATH: process.env.PATH
    }
  }).on('error', function (err) {
    throw err;
  });
  dispatcherService.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});
process.on('exit', function() {
  if (apiService) { apiService.kill(); }
  if (dispatcherService) { dispatcherService.kill(); }
});

gulp.task('clean', function () {
  return gulp.src('build/*', {read: false})
    .pipe(clean())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
});

gulp.task('jsdoc:client', function () {
  // Browserify seems to break this for now.. TODO...
  let terminal = spawn('bash');
  terminal.stdin.write([IOJS, JSDOC, 'build/client/assets/client.js', '-d doc/client'].join(' '));
  terminal.stdin.end();
});
gulp.task('jsdoc:api', function () {
  let terminal = spawn('bash');
  terminal.stdin.write([IOJS, JSDOC, 'build/api/*.js', 'build/api/**/*.js', '-d doc/api'].join(' '));
  terminal.stdin.end();
});
gulp.task('jsdoc:game', function () {
  let terminal = spawn('bash');
  terminal.stdin.write([IOJS, JSDOC, 'build/game/*.js', 'build/game/**/*.js', '-d doc/game'].join(' '));
  terminal.stdin.end();
});
gulp.task('jsdoc:shared', function () {
  let terminal = spawn('bash');
  terminal.stdin.write([IOJS, JSDOC, 'build/shared/*.js', 'build/shared/**/*.js', '-d doc/shared'].join(' '));
  terminal.stdin.end();
});
gulp.task('jsdoc:dispatcher', function () {
  let terminal = spawn('bash');
  terminal.stdin.write([
    IOJS, JSDOC,
    'build/dispatcher/*.js',
    'build/dispatcher/**/*.js',
    '-d doc/dispatcher'
  ].join(' '));
  terminal.stdin.end();
});
gulp.task('jsdoc', ['jsdoc:client', 'jsdoc:api', 'jsdoc:game', 'jsdoc:dispatcher', 'jsdoc:shared']);

gulp.task('client:start', function () {
  try {
    connect.serverClose();
  } catch (e) {

  }
  connect.server({
    root: 'build/client',
    port: CLIENT_PORT,
    livereload: LIVERELOAD,
    middleware: function () {
      return [modRewrite([
        '^/api/(.*)$ http://localhost:' + API_PORT + '/$1 [P]'
      ])];
    }
  });
});

gulp.task('less', function () {
  return gulp.src('client/style/index.less')
    .pipe(less({
      compress: false,
      rootpath: ASSET_URL
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('build/client/assets'))
    .pipe(connect.reload());
});

gulp.task('jade', function () {
  return gulp.src('client/index.jade')
    .pipe(jade({
      locals: {
        assetURL: ASSET_URL
      }
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('build/client'))
    .pipe(connect.reload());
});

gulp.task('browserify', function () {
  browserify()
    .transform(babelify)
    .require('./client/index.js', { entry: true })
    .bundle()
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(vinyl('client.js'))
    .pipe(gulp.dest('build/client/assets'))
    .pipe(connect.reload());
});

gulp.task('babel:api', function () {
  return gulp.src('api/**/*')
    .pipe(babel())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('build/api'));
});
gulp.task('babel:dispatcher', function () {
  return gulp.src('dispatcher/**/*')
    .pipe(babel())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('build/dispatcher'));
});
gulp.task('babel:game', function () {
  return gulp.src('game/**/*')
    .pipe(babel())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('build/game'));
});
gulp.task('babel:shared', function () {
  return gulp.src('shared/**/*')
    .pipe(babel())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('build/shared'));
});


gulp.task('babel', ['babel:api', 'babel:dispatcher', 'babel:game', 'babel:shared']);

gulp.task('vendor_bundle', function () {
  return gulp.src('./client/vendor/*.js')
    .pipe(concat('vendor.js'))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('build/client/assets'))
    .pipe(connect.reload());
});

// This function copies all vendor maps into assets...
gulp.task('vendor_maps', function () {
  return gulp.src('./client/vendor/*.map')
    .pipe(gulp.dest('build/client/assets'))
    .pipe(connect.reload())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
});

// This function copies all client assets into build assets...
gulp.task('client_assets', function () {
  // TODO: Compress images?
  // TODO: Compress models?
  // TODO: Automatically upload to a CDN?
  return gulp.src('./client/assets/*')
    .pipe(gulp.dest('build/client/assets'))
    .pipe(connect.reload())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
});

gulp.task('lint', function () {
  gulp.src(_.uniq(allJSFiles))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
});

gulp.task('test:api', function () {
  gulp.src('spec/api.js', {read: false})
    .pipe(exec([IOJS, MOCHA, 'spec/api.js'].join(' '), {
      continueOnError: true
    }))
    .pipe(exec.reporter({
      err: false
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
});

gulp.task('test:game', function () {
  gulp.src('spec/game.js', {read: false})
    .pipe(exec([IOJS, MOCHA, 'spec/game.js'].join(' '), {
      continueOnError: true
    }))
    .pipe(exec.reporter({
      err: false
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
});

gulp.task('test:dispatcher', function () {
  gulp.src('spec/dispatcher.js', {read: false})
    .pipe(exec([IOJS, MOCHA, 'spec/dispatcher.js'].join(' '), {
      continueOnError: true
    }))
    .pipe(exec.reporter({
      err: false
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
});

let defaultTasks = [
  'client_assets',
  'vendor_bundle',
  'vendor_maps',
  'less',
  'babel',
  'jade',
  'browserify',
  'lint'];

gulp.task('default', function () {
  seq('clean', defaultTasks, 'jsdoc');
});

gulp.task('test', function () {
  seq('test:api', 'test:game');
});

gulp.task('watch', function () {
  seq('clean', defaultTasks, 'test', [
    'api:start',
    'dispatcher:start',
    'client:start'
  ], function () {
    watch(gameFiles, function () { seq('babel:game', ['test:game', 'lint', 'dispatcher:start', 'jsdoc:game']); });
    watch(apiFiles, function () { seq('babel:api', ['test:api', 'lint', 'api:start', 'jsdoc:api']); });
    watch(dispatcherFiles, function () { seq('babel:dispatcher', [
      'test:dispatcher',
      'lint',
      'dispatcher:start',
      'jsdoc:dispatcher']);
    });
    watch(clientFiles, function () { seq(['lint', 'browserify', 'jsdoc:client']); });
    watch(lessFiles, function () { seq(['less']); });
    watch(jadeFiles, function () { seq(['jade']); });
    watch(['./spec/api.js'], function () { seq(['test:api']); });
    watch(['./spec/game.js'], function () { seq(['test:game']); });
    watch(['./spec/dispatcher.js'], function () { seq(['test:dispatcher']); });
    watch(['./client/vendor/*.map'], function () { seq(['vendor_maps']); });
    watch(['./client/vendor/*.js'], function () { seq(['vendor_bundle']); });
    watch(['./client/assets/*'], function () { seq(['client_assets']); });
  });
});
