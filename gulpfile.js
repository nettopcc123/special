var gulp = require('gulp'),
    jade = require('gulp-jade'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    stylus = require('gulp-stylus'),
    cssmin = require('gulp-minify-css'),
    del = require('del'),
    connect = require('gulp-connect');

gulp.task('clean', function(cb) {
    del([
        'build/**/img/**/*'
    ], cb);
});

gulp.task('connect', function() {
    connect.server({
        root: 'build',
        port: '8888',
        livereload: true
    })
});

gulp.task('ts_jade', function() {
    gulp.src(['src/**/p/*.jade', 'src/**/*.jade'])
        .pipe(jade({ pretty: false }))
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});
gulp.task('ts_stylus', function() {
    gulp.src('src/**/css/app.styl')
        .pipe(stylus())
        .pipe(cssmin())
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});

gulp.task('ts_js', function() {
    gulp.src('src/**/js/*.js')
        .pipe(uglify().on('error', function(err) {
            gutil.log(err);
            this.emit('end');
        }))
        .pipe(gulp.dest('build'))
});

gulp.task('ts_img', function() {
    gulp.src('src/**/img/**/*')
        .pipe(gulp.dest('build'))
});

gulp.task('ts_font', function() {
    gulp.src('src/**/fonts/*')
        .pipe(gulp.dest('build'))
});


gulp.task('default', function() {
    gulp.start('ts_jade', 'ts_stylus', 'ts_img', 'ts_js', 'watch', 'connect');
});

gulp.task('watch', function() {
    gulp.watch(['src/**/p/*', 'src/**/*.jade'], ['ts_jade']);
    gulp.watch('src/**/css/*', ['ts_stylus']);
    gulp.watch('src/**/js/*', ['ts_js']);
    gulp.watch('src/**/img/**/*', ['ts_img']);
});