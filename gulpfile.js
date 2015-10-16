var gulp = require('gulp');
var http = require('http');
var fs = require('fs');

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
    gulp.watch('src/less/**', ['push']);
});

gulp.task('push', function() {
    // Compile the LESS files into a single CSS file, push it to the remote
    // API.
    gulp.src('src/less/main.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest('build'));

    // TODO: Skip the writing-to-file step and see if we can directly pipe into
    // a variable.

    // Prepare the payload
    var css = fs.readFileSync('build/main.css').toString();
    console.log(css);
    var payload = {
        'css': css
    };

    var body = JSON.stringify(payload);
    var req = http.request({
        // protocol: 'http',
        host: config.PORTAL_DOMAIN + '.ods.com',
        port: 8000,
        method: 'POST',
        path: '/api/management/1.0/domain_theme/',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        }
    });

    req.write(body);
    req.end();
    console.log('Your changes have been pushed and can be browsed:',
        'http://'+config.PORTAL_DOMAIN+'.ods.com:8000/explore/?stage_theme=true');

});
