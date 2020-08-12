const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const less = require("gulp-less");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

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
gulp.task("javascript", function (done) {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("./dist/js"));
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
        "**/*.html",
        "./src/less/styles.less",
        "./src/js/**/*.js",
      ],
      gulp.series(["sass", "less", "javascript"])
    )
    .on("change", browserSync.reload);
});
