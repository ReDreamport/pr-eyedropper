const gulp = require('gulp')
const plumber = require("gulp-plumber")
const concat = require("gulp-concat")
const declare = require("gulp-declare")

const beep = require("beepbeep")

const jade = require("gulp-jade")
const stylus = require("gulp-stylus")

const cleanCss = require("gulp-clean-css")
const autoprefixer = require("gulp-autoprefixer")

const ts = require("gulp-typescript")
const gulpTslint = require("gulp-tslint")
const tsLint = require('tslint')

function errorHandler(err) {
  beep(2)
  console.error(err.toString())
}

const tsProject = ts.createProject("tsconfig.json")

gulp.task('ts', function () {
  const tsResult = gulp.src(["src/**/*.ts", "jade/*.ts"]).pipe(tsProject())
  return tsResult.js.pipe(gulp.dest('./assets/build/'))
})

gulp.task("tslint", () =>
  gulp.src(["src/**/*.ts", "jade/*.ts"])
    .pipe(gulpTslint({
      fix: true,
      formatter: "prose",
      program: tsLint.Linter.createProgram("./tsconfig.json")
    }))
    .pipe(gulpTslint.report({
      emitError: false,
      allowWarnings: true
    }))
)

gulp.task("template", function () {
  gulp.src(["src/template/**/*.jade"])
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(jade({ client: true }))
    .pipe(declare({ namespace: "ST", noRedeclare: true }))
    .pipe(concat("template.js"))
    .pipe(gulp.dest("./assets/build/web"))
})

const CSS_PREFIX = ["chrome >= 34"]

gulp.task("stylus", function () {
  gulp.src("src/style/*.styl")
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(stylus({}))
    .pipe(autoprefixer(CSS_PREFIX))
    .pipe(cleanCss({}))
    .pipe(gulp.dest("./assets/build/css"))
})

gulp.task("page", function () {
  gulp.src("src/page/*.jade")
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(jade({ client: false }))
    .pipe(gulp.dest("./assets/build"))
})

gulp.task("watch", ["default"], function () {
  gulp.watch('src/**/*.ts', ["ts"])
  gulp.watch('src/template/**/*.jade', ["template"])
  gulp.watch('src/style/*.styl', ["stylus"])
  gulp.watch('src/page/*.jade', ["page"])
})

gulp.task("default", ["ts", "tslint", "template", "stylus", "page"])
