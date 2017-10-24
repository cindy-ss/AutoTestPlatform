// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var async = require('async');
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var browserifyTransform = require('vinyl-transform');
var extend = require('extend');
var fs = require('fs-extra');
var glob = require('wildglob');
var onSuccess = require('@marcom/ac-async-helpers').onSuccess();
var path = require('path');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');

var scssGlob = [
    './static/src/scss/**/*.scss'
];

var sassConfig = {
    'default-encoding': 'UTF-8',
    sourcemap: false
};

var assets = require('@marcom/ac-assets');

// Compile our Sass
// gulp.task('sass', function() {
//
//     // wrap this in ac-assets to get
//     // all the sass load paths
//     return gulp.src(scssGlob)
//         .pipe(sass(sassConfig)
//             .on('error', sass.logError))
//         .pipe(autoprefixer())
//         .pipe(rename({suffix: '.built'}))
//         .pipe(gulp.dest('./static/build/styles/'))
//         .on('error', function (data) {
//             throw new Error(data);
//         });
// });

gulp.task('sass', function() {

    assets.getAssetsForCollection('sass', function(err, sassLoadPaths) {

        sassConfig.includePaths = sassLoadPaths;

        return gulp.src(scssGlob)
            .pipe(sass(sassConfig)
                .on('error', sass.logError))
            .pipe(autoprefixer())
            .pipe(rename({suffix: '.built'}))
            .pipe(gulp.dest('./static/build/styles/'))
            .on('error', function (data) {
                throw new Error(data);
            });
    });
});


// Compile our Javascript
gulp.task('js', function() {

    var browserified = browserifyTransform(function(filename) {
        var b = browserify(filename);
        b.external('ac-analytics');
        return b.bundle();
    });

    return gulp.src('./static/src/js/*')
        .pipe(browserified)
        .pipe(rename({suffix: '.built'}))
        .pipe(gulp.dest('./static/build/scripts'));
});


// Move HTML files
gulp.task('html', function(callback) {
    var htmlGlob = './static/src/html/**/*.html';
    var htmlRoot = '';

    // Find htmlRoot
    htmlGlob.split('/').forEach(function(segment) {
        if (!segment.match('[*]')) {
            htmlRoot += segment + '/';
        }
    });

    glob(htmlGlob, onSuccess(function(files) {
        async.eachLimit(files, 8 , function(from, callback) {

            var to = './static/build/' + from.replace(htmlRoot, '');
            fs.copy(from, to, onSuccess(callback));

        }, callback);
    }));
});


gulp.task('watch', ['default'], function() {
    gulp.watch(['static/src/**/*'], ['default']);
});


gulp.task('clean', function(callback){
    fs.remove('./static/build/', callback);
});


// Run all our tasks
gulp.task('default', ['sass','html','js']);
