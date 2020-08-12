const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const less = require("gulp-less");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
const kit = require("gulp-kit");

// Sass
gulp.task("sass", function (done) {
  return gulp
    .src(["./src/sass/**/*.scss", "!./src/sass/widget.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cssnano())
    .pipe(sourcemaps.write("."))
    .pipe(
      rename(function (path) {
        if (!path.extname.endsWith(".map")) {
          path.basename += ".min";
        }
      })
    )
    .pipe(gulp.dest("./dist/css"));
  done();
});

// Less
gulp.task("less", function (done) {
  return gulp
    .src("./src/less/styles.less")
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(cssnano())
    .pipe(sourcemaps.write("."))
    .pipe(rename("./styles.min.css"))
    .pipe(gulp.dest("./dist/css"));
  done();
});

// Javascript
// alternative src example as an array for order of concatination
//.src["./src/js/project.js","./src/js/alert.js"]
gulp.task("javascript", function (done) {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(concat("project.js"))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("./dist/js"));
  done();
});

// Images optimization
gulp.task("imagemin", function (done) {
  return gulp
    .src("./src/img/**/*.+(png|jpg|gif|svg)")
    .pipe(cache(imagemin()))
    .pipe(gulp.dest("./dist/img/"));
  done();
});

// HTML kit templating

gulp.task("kit", function (done) {
  return gulp.src("./html/**/*.kit").pipe(kit()).pipe(gulp.dest("./"));
  done();
});

// Watch task with BrowserSync

gulp.task("watch", function () {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    browser: "chrome",
  });
  gulp
    .watch(
      [
        "./src/sass/**/*.scss",
        "*./html/**/*.kit",
        "./src/less/styles.less",
        "./src/js/**/*.js",
        "./src/img/**/*.+(png|jpg|gif|svg)",
      ],
      gulp.series(["sass", "less", "javascript", "imagemin", "kit"])
    )
    .on("change", browserSync.reload);
});

gulp.task("clear-cache", function (done) {
  return cache.clearAll(done);
});

// Gulp default command
gulp.task("default", gulp.series(["watch"]));
