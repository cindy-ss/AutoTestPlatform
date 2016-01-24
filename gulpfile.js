/**
 * Created by Edel on 15/12/2.
 */
var gulp = require('gulp');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');

gulp.task('default', ['less'], function() {
    console.log("Done");
//}).watch('views/*', function(event){
//    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');

});

gulp.task('less', function(){
    gulp.src('less/*')
        .pipe(less())
        .pipe(minifyCss())
        .pipe(gulp.dest('./public/css'));
});

