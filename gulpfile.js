const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const imagemin = require('gulp-imagemin');

const params = {
  output: 'public/',
  htmlEntry: 'src/client/index.html',
  levels: ['desktop', 'mobile']
};

gulp.task('default', ['server', 'dev']);

gulp.task('dev', ['html', 'sass:dev', 'images', 'js']);

gulp.task('build', ['html', 'sass', 'images', 'js']);

gulp.task('js', ['js:home', 'js:observe']);

gulp.task('server', function () {
  browserSync.init({
    server: params.output
  });

  gulp.watch(params.levels.map(function (level) {
    const cssGlob = 'src/client/' + level + '.blocks/**/*.scss';

    return cssGlob;
  }), ['sass:dev']);

  gulp.watch('src/client/**/*.js', ['js']);

  gulp.watch('src/client/**/*.html', ['html']);
});

gulp.task('html', function () {
  gulp.src('src/client/**/*.html')
    .pipe(gulp.dest(params.output))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', function () {
  return params.levels.forEach(function (level) {
    gulp.src('src/client/' + level + '.blocks/**/*.scss')
      .pipe(sass({includePaths: ['src/client/']}).on('error', sass.logError))
      .pipe(concat(level + '.style.css'))
      .pipe(autoprefixer({
        browsers: ['last 2 versions']
      }))
      .pipe(cleanCss())
      .pipe(gulp.dest(params.output));
  });
});

gulp.task('sass:dev', function () {
  return watch('src/client/**/*.scss', { ignoreInitial: false }, function () {
    return params.levels.forEach(function (level) {
      gulp.src('src/client/' + level + '.blocks/**/*.scss')
        .pipe(sass({includePaths: ['src/client/']}).on('error', sass.logError))
        .pipe(concat(level + '.style.css'))
        .pipe(gulp.dest(params.output))
        .pipe(browserSync.stream());
    });
  });
});

gulp.task('images', function () {
  gulp.src('src/client/**/*.{jpg,png,svg}')
    .pipe(imagemin())
    .pipe(flatten())
    .pipe(gulp.dest(params.output + 'assets/'));
});

gulp.task('js:home', function () {
  gulp.src(['src/client/**/*.js', '!src/client/**/stream.js'])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(params.output))
    .pipe(browserSync.stream());
});

gulp.task('js:observe', function () {
  gulp.src('src/client/**/stream.js')
    .pipe(concat('observe.js'))
    .pipe(gulp.dest(params.output))
    .pipe(browserSync.stream());
});
