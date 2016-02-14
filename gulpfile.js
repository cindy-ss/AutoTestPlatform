/**
 * Created by Edel on 15/12/2.
 */
var gulp = require('gulp');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var del = require('del');
var merge = require("merge-stream");

var bsSrc = "./bower_components/bootstrap/dist/";

var styleDest = gulp.dest("./public/style");
var scriptDest = gulp.dest("./public/script");

//var gulpType = {};
//gulpType.jsBuild = function(src, dest){
//    return gulp.src(src)
//        .pipe(gulp.dest(dest));
//};
//gulpType.cssBuild = function(src, dest){
//    return gulp.src(src)
//        .pipe(gulp.dest(dest));
//};



//gulp.task("clean", function(cb){
//    del(["./public/"], cb)
//});

gulp.task("default", ["bs", "angular", "html", "script"], function(){
});

gulp.task('bs', function(cb){
    gulp.src(bsSrc + "css/*.min.*")
        .pipe(styleDest);
    gulp.src(bsSrc + "js/*.min.*")
        .pipe(scriptDest);
    gulp.src(bsSrc + "fonts/*")
        .pipe(gulp.dest("./public/fonts/"));
});

gulp.task("angular", function(){
    gulp.src("./bower_components/angular/*.min.js")
        .pipe(scriptDest);
    //gulp.src("./bower_components/angular-route/*.min.js")
    //    .pipe(scriptDest);
});

gulp.task("html", function(){
    gulp.src("./index.html")
        .pipe(gulp.dest("./public"));
    gulp.src("./views/*.html")
        .pipe(gulp.dest("./public/views/"));
});

gulp.task("script", function(){
    gulp.src(["./scripts/main.js", "./scripts/util.js"])
        .pipe(scriptDest);
});