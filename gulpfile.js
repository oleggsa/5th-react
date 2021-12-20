const {src, dest, series, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();

function html() {
  return src('./dist/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('build'));
}

function scss() {
  return src('./dist/scss/**.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('build'));
}

function clear() {
  return del('build');
}

function serve() {
  sync.init({
    server: './build'
  });

  watch('dist/**.html', series(html)).on('change', sync.reload);
  watch('dist/scss/**.scss', series(scss)).on('change', sync.reload);
}

exports.build = series(clear, scss, html);
exports.serve = series(clear, scss, html, serve);
exports.clear = clear;
exports.html = html;
exports.scss = scss;