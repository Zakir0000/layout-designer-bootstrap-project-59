
// Require dependencies
const { src, dest, watch, series } = require('gulp');

const pug          = require('gulp-pug');
const sass         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const htmlmin      = require('gulp-htmlmin');
const browserSync  = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean        = require('gulp-clean');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const svgSprite    = require('gulp-svg-sprite');
const surge        = require('gulp-surge');


// Define tasks

function images() {
  return src('app/assets/**/*.jpg',)
  .pipe(dest('build/assets'));
};

function sprite() {
  return src('app/assets/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg',
          example: true,
          stack: false,
          
        }
      }
    }))
    .pipe(dest('build/assets/'))
}

function compilePug() {
  return src('app/pug/*.pug')
    .pipe(pug())
    .pipe(dest('build/'))
    .pipe(browserSync.stream())
}

function compileSass() {
  return src('app/scss/app.scss')
    .pipe(autoprefixer({ overrideBrowserlist: ['last 10 version'] }))
    .pipe(concat('style.min.css'))
    .pipe(sass({ outputStyle: 'compressed'}))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream())
};

function watching(){
  browserSync.init({
    server: {
      baseDir: 'build/'
    }
  });
  watch(['app/scss/app.scss'], compileSass)
  watch(['app/images/src'], images)
  watch(['app/pug/*.pug'], compilePug)
  watch(['build/*.html']).on('change', browserSync.reload)
}

function cleanBuild() {
  return src('build')
    .pipe(clean())
}

function cleanOfStack() {
  return src('build/assets/stack')
    .pipe(clean())
}

function Surge() {
  return surge({
    project: './build',
    domain: 'https://hexlet-chat-project-from-Zakir-Khunkaev.surge.sh'
  });
};



exports.compileSass = compileSass;
exports.images = images;
exports.sprite = sprite;
exports.compilePug = compilePug;
exports.watching = watching;
exports.surge = Surge;
exports.cleanBuild = cleanBuild;
exports.cleanOfStack = cleanOfStack;

exports.default = series(cleanBuild, compilePug, compileSass, images, sprite, cleanOfStack, watching);

