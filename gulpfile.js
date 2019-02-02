const autoprefixer = require('gulp-autoprefixer');
const bs = require('browser-sync').create();
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const imagemin = require('gulp-imagemin');

const params = {
  output: 'public/',
  levels: ['desktop', 'mobile']
};

gulp.task('server', () => {
  bs.init({
    server: params.output
  });

  gulp.watch('src/client/**/*.html', ['html']);
  gulp.watch('src/client/**/*.scss', ['sass:dev']);
  gulp.watch('src/client/**/*.ts', ['js']);
});

gulp.task('default', ['server', 'dev']);
gulp.task('dev', ['html', 'sass:dev', 'images', 'js']);
gulp.task('build', ['html', 'sass', 'images', 'js']);
gulp.task('js', ['ts:home', 'ts:observe']);

gulp.task('html', () => {
  gulp.src('src/client/**/*.html')
    .pipe(gulp.dest(params.output))
    .pipe(bs.stream());
});

gulp.task('sass', () => params.levels.forEach(level => {
  gulp.src('src/client/' + level + '.blocks/**/*.scss')
    .pipe(sass({includePaths: ['src/client/']}).on('error', sass.logError))
    .pipe(concat(level + '.style.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest(params.output));
}));

gulp.task('sass:dev', () => params.levels.forEach(level => {
  gulp.src('src/client/' + level + '.blocks/**/*.scss')
    .pipe(sass({includePaths: ['src/client/']}).on('error', sass.logError))
    .pipe(concat(level + '.style.css'))
    .pipe(gulp.dest(params.output))
    .pipe(bs.stream());
}));

gulp.task('images', () => {
  gulp.src('src/client/**/*.{jpg,png,svg}')
    .pipe(imagemin())
    .pipe(flatten())
    .pipe(gulp.dest(params.output + 'assets/'));
});

gulp.task("ts:home", () => browserify({
  basedir: './src/client',
  debug: true,
  entries: [
    'desktop.blocks/card/card.ts',
    'desktop.blocks/camera/camera.ts',
    'mobile.blocks/menu/menu.ts'
  ],
  cache: {},
  packageCache: {}
})
  .plugin(tsify)
  .bundle()
  // eslint-disable-next-line no-console
  .on('error', error => console.error(error.toString()))
  .pipe(source('index.bundle.js'))
  .pipe(gulp.dest(params.output))
);

gulp.task("ts:observe", () => browserify({
  basedir: './src/client',
  debug: true,
  entries: ['desktop.blocks/stream/stream.ts'],
  cache: {},
  packageCache: {}
})
  .plugin(tsify)
  .bundle()
  // eslint-disable-next-line no-console
  .on('error', error => console.error(error.toString()))
  .pipe(source('observe.bundle.js'))
  .pipe(gulp.dest(params.output))
);
