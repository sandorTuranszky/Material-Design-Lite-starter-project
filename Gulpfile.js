'use strict';
var gulp = require('gulp');
var compass = require('gulp-compass');
var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync').create();

var ENV = process.env.NODE_ENV || 'develop';

// Static Server + watching scss/html files
gulp.task('serve', ['inject:index:js:css', 'inject:index:bower', 'sass'], function () {
    console.log('\nStart server ...\n');
    browserSync.init({
        server: {
            baseDir: "./app",
            routes: {
                "/bower_components": "bower_components",
                "/vendor": "vendor"
            }
        }
    });

    gulp.watch("app/scss/**/*.scss", ['sass']);
    gulp.watch("app/**/*.{js,html,css}", ['inject:index:js:css']);
    gulp.watch("bower_components/**/*.{js,css}", ['inject:index:bower']);
    gulp.watch("app/**/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers

gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(compass({
            style: ENV === 'develop' ? 'nested' : 'compressed',
            //sourcemap: ENV === 'develop',
            css: 'app/css',
            sass: 'app/scss'
        }))
        .pipe(browserSync.stream());
});

// Inject files into index.html
gulp.task('inject:index:js:css', function () {
    return gulp.src('./app/index.html')
        .pipe(inject(gulp.src(['./app/js/**/*.js', './app/css/**/*.css'], {read: false}), {
            ignorePath: 'app',
            addRootSlash: false
        }))
        .pipe(gulp.dest('./app'));
});

//Inject bower components into index.html
gulp.task('inject:index:bower', function () {
    return gulp.src('./app/index.html')
        .pipe(inject(gulp.src(mainBowerFiles(), {read: false}), {name: 'bower'}))
        .pipe(gulp.dest('./app'));
});