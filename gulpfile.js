/**
 * Created by Edel on 15/12/2.
 */
var gulp = require('gulp');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var del = require('del');

var bsSrc = "./bower_components/bootstrap/dist/";

var styleDest = gulp.dest("./public/style");
var scriptDest = gulp.dest("./public/script");

gulp.task("clean", function(cb){
    del(["./public/*"], cb)
});

gulp.task("default", ["bs"], function(){
    console.log("DONE");
});

gulp.task('bs', ["clean"], function(cb){
    gulp.src(bsSrc + "css/*.min.*")
        .pipe(styleDest);
    gulp.src(bsSrc + "js/*.min.*")
        .pipe(scriptDest);
    gulp.src(bsSrc + "fonts/*")
        .pipe(gulp.dest("./public/fonts/"))
        .on("end", function(){
            cb();
        });
});

gulp.task("angular", ["bs"], function(){
    gulp.src("./bower_components/angular*/*.min.js")
        .pipe(scriptDest);
    //gulp.src("./bower_components/angular-route/*.min.js")
    //    .pipe(scriptDest);
});

gulp.task("html", ["angular"], function(){
    gulp.src("./index.html")
        .pipe(gulp.dest("./public"));
    gulp.src("./views/*.html")
        .pipe(gulp.dest("./public/views/"))
});

gulp.task("script", ["html"], function(){
    gulp.src(["./scripts/main.js", "./scripts/util.js"])
        .pipe(scriptDest);
});