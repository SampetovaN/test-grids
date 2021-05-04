"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var webp = require("gulp-webp");

gulp.task("clean", function () {
    return del("build");
});

gulp.task("copy", function () {
    return gulp.src([
        "source/img/**"
    ], {
        base: "source"
    })
        .pipe(gulp.dest("build"))
});

gulp.task("script", function () {
    return gulp.src("source/js/*.js")
        .pipe(uglify())
        .pipe(rename({suffix: "-min"}))
        .pipe(gulp.dest("build/js"))
});

gulp.task("html", function () {
    return gulp.src("source/*.html")
        .pipe(htmlmin({ collapseWhitespace: true, ignoreCustomFragments: [/\s<br>\s/] }))
        .pipe(gulp.dest("build"));
});

gulp.task("webp", function () {
    return gulp.src("source/img/!**!/*.{png,jpg}")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest("source/img"));
});

gulp.task("css", function () {
    return gulp.src("source/sass/style.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());
});


gulp.task("server", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("source/sass/**/*.scss", gulp.series("css"));
    gulp.watch("source/js/*.js", gulp.series("script", "refresh"));
    gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
    server.reload();
    done();
});

gulp.task("build", gulp.series("clean", "copy", "css", "script", "html"));
gulp.task("start", gulp.series("build", "server"));
