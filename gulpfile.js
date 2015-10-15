var gulp = require('gulp');

var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

var config = require('./config');

gulp.task('default', ['help']);

gulp.task('help', function() {
    //console.log(config.PORTAL_HOST)
    // TODO: Document the available tasks
    console.log('You can do this.. or that...');
});

gulp.task('watch', function() {
    // TODO: Watch, and if a LESS file changes, push it.
});

gulp.task('push', function() {
    // Compile the LESS files into a single CSS file, push it to the remote
    // API.
    gulp.src('src/less/main.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest('build'));

})
