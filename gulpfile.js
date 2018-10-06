const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const csscomb = require('gulp-csscomb');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const imagemin = require('gulp-imagemin')

const params = {
  output: 'public/',
  htmlEntry: 'src/index.html',
  levels: ['desktop', 'mobile']
};

gulp.task('default', ['server', 'dev']);

gulp.task('dev', ['html', 'sass:dev', 'images', 'js']);

gulp.task('build', ['html', 'sass', 'images', 'js']);

gulp.task('server', function () {
  browserSync.init({
    server: params.output
  });

  gulp.watch(params.levels.map(function (level) {
    const cssGlob = 'src/' + level + '.blocks/**/*.scss';
    return cssGlob;
  }), ['sass:dev']);

  gulp.watch('src/**/*.js', ['js']);

  gulp.watch(params.htmlEntry, ['html'])
});

gulp.task('html', function () {
  gulp.src(params.htmlEntry)
    .pipe(gulp.dest(params.output))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('sass', function () {
  return params.levels.forEach(function (level) {
    gulp.src('src/' + level + '.blocks/**/*.scss')
      .pipe(concat(level + '.style.css'))
      .pipe(sass({includePaths: ['src']}).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions']
      }))
      .pipe(cleanCss())
      .pipe(gulp.dest(params.output))
  })
});

gulp.task('sass:dev', function () {
  return watch('src/**/*.scss', { ignoreInitial: false }, function () {
    return params.levels.forEach(function (level) {
      gulp.src('src/' + level + '.blocks/**/*.scss')
        .pipe(concat(level + '.style.css'))
        .pipe(sass({includePaths: ['src']}).on('error', sass.logError))
        .pipe(gulp.dest(params.output))
        .pipe(browserSync.stream());
    })
  })
});

gulp.task('images', function () {
  gulp.src('src/**/*.{jpg,png,svg}')
    .pipe(imagemin())
    .pipe(flatten())
    .pipe(gulp.dest(params.output + 'assets/'));
});

gulp.task('js', function () {
  gulp.src('src/**/*.js')
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(params.output))
    .pipe(browserSync.stream());
});

gulp.task('csscomb', function () {
  gulp.src('src/**/*.scss')
    .pipe(csscomb())
    .pipe(gulp.dest('src/'))
});
