
// Require dependencies
const { src, dest, watch, series, parallel } = require('gulp');

const pug          = require('gulp-pug');
const sass         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const htmlmin      = require('gulp-htmlmin');
const browserSync  = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean        = require('gulp-clean');
const avif         = require('gulp-avif');
const webp         = require('gulp-webp')
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const svgSprite    = require('gulp-svg-sprite');
const surge        = require('gulp-surge');


// Define tasks

function images() {
  return src(['app/images/src/*.*', '!app/images/src/*.svg'])
    .pipe(newer('app/images'))
    .pipe(avif({ quality: 50 }))

    .pipe(src('app/images/src/*.*'))
    .pipe(newer('app/images'))
    .pipe(webp())

    .pipe(src('app/images/src/*.*'))
    .pipe(newer('app/images'))
    .pipe(imagemin())

    .pipe(dest('app/images'))
}

function sprite() {
  return src('app/assets/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg',
          example: true
        }
      }
    }))
    .pipe(dest('app/assets/'))
}

function compilePug() {
  return src('app/pug/index.pug')
    .pipe(pug())
    .pipe(dest('app/'))
    .pipe(browserSync.stream())
}

function compileSass() {
  return src('app/scss/app.scss')
    .pipe(autoprefixer({ overrideBrowserlist: ['last 10 version'] }))
    .pipe(concat('style.min.css'))
    .pipe(sass({ outputStyle: 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
};

function watching(){
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
  watch(['app/scss/app.scss'], compileSass)
  watch(['app/images/src'], images)
  watch(['app/pug/index.pug'], compilePug)
  watch(['app/*.html']).on('change', browserSync.reload)
}

function building(){
  return src([
    'app/css/style.min.css',
    '!app/assets/**/*.html',
    'app/assets/**/*.*',
    '!app/assets/**/*.svg',
    'app/assets/**/sprite.svg',
    'app/**/*.html',
  ], {base: 'app'})
    .pipe(dest('build'))
}

function cleanToApp() {
  return src('app/index.html')
    .pipe(clean())
}

function cleanBuild() {
  return src('build')
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
exports.building = building;
exports.sprite = sprite;
exports.compilePug = compilePug;
exports.watching = watching;
exports.surge = Surge;
exports.cleanToApp = cleanToApp;

exports.build = series(cleanBuild, building);
exports.default = series(cleanToApp, compilePug, compileSass, images, watching);




