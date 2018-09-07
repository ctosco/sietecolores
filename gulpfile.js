var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var minify = require('gulp-minify');
var compass = require('gulp-compass');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
var browserSync = require('browser-sync').create();
var ghPages = require('gulp-gh-pages');


gulp.task('nunjucks', function() {
  nunjucksRender.nunjucks.configure(['templates/']);

  // Gets .html and .nunjucks files in pages
  return gulp.src('pages/**/*.+(html|nunjucks)')
  // Renders template with nunjucks
  .pipe(nunjucksRender())
  // output files in .www folder
  .pipe(gulp.dest('.www'))
});

// gulp.task('default', function () {
//   return gulp.src('src/templates/*.html')
//     .pipe(nunjucksRender({
//       path: ['src/templates/'] // String or Array
//     }))
//     .pipe(gulp.dest('dist'));
// });

gulp.task('compass', function() {
  gulp.src('./sass/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: 'stylesheets',
      sass: 'sass'
    }))
    .pipe(gulp.dest('stylesheets'));
});

gulp.task('css-minify', function() {
    return gulp.src('stylesheets/**.css')
        .pipe(cssnano())
        .pipe(gulp.dest('.www/css'));
});

gulp.task('minify-html', function() {
  return gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('.www'))
});

gulp.task('compress', function() {
  gulp.src('js/*.js')
    .pipe(minify({
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('.www/js'))
});

gulp.task('image-min', () => {
  return gulp.src('img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('.www/images'));
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Static Server + watching scss/html files
gulp.task('serve', ['compass'], function() {

    browserSync.init({
        server: ".www"
    });

    gulp.watch("sass/*.scss", ['compass']);
    gulp.watch(".www/*.html").on('change', browserSync.reload);
});

gulp.task('deploy', function() {
  return gulp.src('./.www/**/*')
    .pipe(ghPages({remoteUrl: "https://github.com/ctosco/sietecolores.git", origin: "github"}));
});

gulp.task('build', ['nunjucks', 'compass', 'css-minify', 'compress', 'image-min']);
