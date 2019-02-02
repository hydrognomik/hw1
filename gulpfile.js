const path = require('path');
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
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const merge = require('merge-stream');
const handlebars = require('gulp-handlebars');

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
  gulp.watch('src/client/**/*.hbs', ['templates']);
});

gulp.task('default', ['server', 'dev']);
gulp.task('dev', ['html', 'sass:dev', 'images', 'js', 'templates']);
gulp.task('build', ['html', 'sass', 'images', 'js']);
gulp.task('js', ['ts:home', 'ts:observe', 'ts:index']);

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

gulp.task("ts:index", () => browserify({
  basedir: './src/client',
  debug: true,
  entries: [
    'mobile.blocks/menu/menu.ts',
    'scripts/index.ts',
    'scripts/router.ts'
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

gulp.task("ts:home", () => browserify({
  basedir: './src/client',
  debug: true,
  entries: [
    'desktop.blocks/camera/camera.ts'
  ],
  cache: {},
  packageCache: {}
})
  .plugin(tsify)
  .bundle()
  // eslint-disable-next-line no-console
  .on('error', error => console.error(error.toString()))
  .pipe(source('home.bundle.js'))
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

gulp.task('templates', function() {
  // Assume all partials start with an underscore
  // You could also put them in a folder such as source/templates/partials/*.hbs
  const partials = gulp.src(['src/client/templates/**/_*.hbs'])
    .pipe(handlebars())
    .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
      imports: {
        processPartialName: function(fileName) {
          // Strip the extension and the underscore
          // Escape the output with JSON.stringify
          return JSON.stringify(path.basename(fileName, '.js').substr(1));
        }
      }
    }));

  const templates = gulp.src('src/client/templates/**/[^_]*.hbs')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Templates',
      noRedeclare: true // Avoid duplicate declarations
    }));

  // Output both the partials and the templates as build/js/templates.js
  return merge(partials, templates)
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(params.output));
});
