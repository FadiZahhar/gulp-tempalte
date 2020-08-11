const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

//sass
gulp.task("sass", function (done) {
  return gulp
    .src(["./src/sass/**/*.scss", "!./src/sass/widget.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/css"));
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
    .watch(["./src/sass/**/*.scss", "**/*.html"], gulp.series(["sass"]))
    .on("change", browserSync.reload);
});
