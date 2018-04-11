let gulp = require('gulp');
let sass = require('gulp-sass');
let rollup = require('rollup-stream');
let gutil = require('gulp-util');
let buffer = require('gulp-buffer');
let rename = require('gulp-rename');
let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify');
let autoprefixer = require('gulp-autoprefixer');
let fileinclude = require('gulp-file-include');
let source = require('vinyl-source-stream');
let resolveNode = require('rollup-plugin-node-resolve')
let commons = require('rollup-plugin-commonjs');
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;

let fs                = require('fs');
let path              = require('path');
let cssTaskDictionary = [];
let cssTaskList       = [];
let jsTaskDictionary  = [];
let jsTaskList        = [];
let watchTaskList     = [];

// SRC PATH definitions
let publicFolder = './src';
let srcFolder = './src/assets';

let cssSrcPath = `${srcFolder}/sass`;
let cssDest    = `${publicFolder}`;

let jsSrcPath = `${srcFolder}/js/src`;
let jsDest    = `${publicFolder}/js`;

let htmlSrcPath = `${srcFolder}/html`;
let htmlDest    = `${publicFolder}`;

// Gather Scss src files to watch and compile
(fs.readdirSync(cssSrcPath) || []).filter(directory => {
  let isDirectory = fs.lstatSync(path.join(cssSrcPath, directory)).isDirectory();
  return  !/global/.test(directory) &&
          !/theme/.test(directory) &&
          isDirectory;
}).forEach(module => {
  (fs.readdirSync(path.join(cssSrcPath, module)) || []).filter(moduleCtrl => {
    return fs.lstatSync(path.join(cssSrcPath, module, moduleCtrl)).isDirectory();
  }).forEach(ctrl => {
    fs.readdirSync(path.join(cssSrcPath, module, ctrl)).forEach(action => {
      cssTaskDictionary.push({ module: module, ctrl: ctrl, action: action });
    });
  });
});

cssTaskDictionary.forEach(taskDef => {

  let action = taskDef.action.replace(/\.scss/, '');
  action = action.replace(/_/, '');
  let taskSuffix = '-' + taskDef.module + '-' + taskDef.ctrl + '-' + action;
  let taskName = 'css' + taskSuffix;
  cssTaskList.push(taskName);

  // Output compressed styles for prod and dev
  let outputStyle = {outputStyle: 'expanded'};
  outputStyle.outputStyle = 'compressed';
  // if (process.env.ENV == 'prod' || process.env.ENV == 'dev') {
  // }

  // Sass will wat0 ch for changes in these actions
  let srcPathFile = path.join(cssSrcPath, taskDef.module, taskDef.ctrl, taskDef.action);
  let destination;

  if (taskDef.module == 'main') {
    destination = path.join(publicFolder);
  } else {
    destination = path.join(cssDest, taskDef.module, taskDef.ctrl);
  }


  gulp.task(taskName, () => {
    gulp.src([srcPathFile])
      .pipe(sass(outputStyle).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
        flexbox: true,
        }))
      .pipe(gulp.dest(destination)
    );
  });

  // Instantiate ctrl specific watch tasks
  let watchTaskName = 'watch-' + taskName;
  watchTaskList.push(watchTaskName);
  gulp.task(watchTaskName, () => {
    gulp.watch([srcPathFile], [taskName]);
  });
});


// Watch for css/global
// Triggers all css tasks
gulp.task('global', () => {
  gulp.watch(`${cssSrcPath}/global/*.scss`, cssTaskList);
  gulp.watch(`${cssSrcPath}/_ebm-overrides.scss`, cssTaskList);
  gulp.watch(`${cssSrcPath}/global.scss`, cssTaskList);

  gulp.watch(`${publicFolder}/**/**`).on('change', reload);
});
// watchTaskList.push('global');

// Fileinclude
gulp.task('fileinclude', function() {
  gulp.src([`!${htmlSrcPath}/includes/**`, `!${htmlSrcPath}/exchange/components/**`, `${htmlSrcPath}/**/*.html`])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(htmlDest));
  gulp.watch(`${htmlSrcPath}/**/*.html`, ['fileinclude']);
});
//watchTaskList.push('fileinclude');

gulp.task('browser-sync', function() {
  browserSync.init({
    port: 3000,
    proxy: 'http://localhost:4200',
    open: false,
    // server: {
      // baseDir: htmlDest
    // },
    ui: {
      port: 3001
    }
  });
});
// watchTaskList.push('browser-sync');

// Build styles task
gulp.task('styles', cssTaskList);

// Build js task
gulp.task('js', jsTaskList);

// Keep watching CSS, JS and HTML changes
gulp.task('watch', watchTaskList);

// Build both CSS and JS tasks in Jenkins build
gulp.task('default', ['styles', 'js', 'fileinclude']);
