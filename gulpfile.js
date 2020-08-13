const gulp = require("gulp");

const { series, parallel, dest } = require("gulp");

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
//const htmlmin = require("gulp-htmlmin");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const del = require("del");
const plumber = require("gulp-plumber");
const notifier = require("gulp-notifier");

notifier.defaults({
  messages: {
    sass: "CSS was successfully compiled!",
    js: "Javascript is ready!",
    kit: "HTML was delivered!",
  },
  prefix: "=====",
});

const filesPath = {
  sass: "./src/sass/**/*.scss",
  less: "./src/less/styles.less",
  js: "./src/js/**/*.js",
  images: "./src/img/**/*.+(png|jpg|gif|svg)",
  html: "./src/html/**/*.kit",
};

// Sass

function sassTask(done) {
  gulp
    .src([filesPath.sass, "!./src/sass/widget.scss"])
    .pipe(plumber({ errorHandler: notifier.error }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
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
    .pipe(dest("./dist/css"))
    .pipe(notifier.success("sass"));
  done();
}

// Less

function lessTask(done) {
  gulp
    .src(filesPath.less)
    .pipe(plumber({ errorHandler: notifier.error }))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(cssnano())
    .pipe(sourcemaps.write("."))
    .pipe(rename("./styles.min.css"))
    .pipe(dest("./dist/css"));
  done();
}

// Javascript
// alternative src example as an array for order of concatination
//.src["./src/js/project.js","./src/js/alert.js"]
function jsTask(done) {
  gulp
    .src(filesPath.js)
    .pipe(plumber({ errorHandler: notifier.error }))
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("project.js"))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("./dist/js"))
    .pipe(notifier.success("js"));
  done();
}

// Images optimization
function imagesTask(done) {
  gulp.src(filesPath.images).pipe(cache(imagemin())).pipe(dest("./dist/img/"));
  done();
}

// HTML kit templating
function kitTask(done) {
  gulp
    .src(filesPath.html)
    .pipe(plumber({ errorHandler: notifier.error }))
    .pipe(kit())
    /*.pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )*/
    .pipe(dest("./dist"))
    .pipe(notifier.success("kit"));
  done();
}

// Watch task with BrowserSync
function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    browser: "chrome",
  });
  gulp
    .watch(
      [
        filesPath.sass,
        filesPath.html,
        filesPath.less,
        filesPath.js,
        filesPath.images,
      ],
      parallel([sassTask, lessTask, jsTask, imagesTask, kitTask])
    )
    .on("change", browserSync.reload);
}

function clearCache(done) {
  return cache.clearAll(done);
}

// zip project
function zipTask(done) {
  gulp
    .src(["./**/*", "!./node_modules/**/*"])
    .pipe(zip("project.zip"))
    .pipe(dest("./"));
  done();
}

// Clean Dist
function clean(done) {
  del(["./dist/**/*"]);
  done();
}

// Gulp individual tasks

exports.sassTask = sassTask;
exports.lessTask = lessTask;
exports.jsTask = jsTask;
exports.imagesTask = imagesTask;
exports.kitTask = kitTask;
exports.watch = watch;
exports.clearCache = clearCache;
exports.zipTask = zipTask;
exports.clean = clean;

// Gulp serve

exports.build = parallel(sassTask, lessTask, jsTask, imagesTask, kitTask);

// Gulp default command

exports.default = series(exports.build, watch);
