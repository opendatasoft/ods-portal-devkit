var gulp = require('gulp');
var http = require('http');
var fs = require('fs');
var yargs = require('yargs');
var argv = yargs.argv;

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
    gulp.watch(argv.lesswatchdir||'src/less/**', ['push']);
});

gulp.task('push', function() {
    // Compile the LESS files into a single CSS file, push it to the remote
    // API.
    gulp.src(argv.lessfile||'src/less/main.less')
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
        protocol: config.ODS_PORTAL_PROTOCOL,
        host: config.ODS_PORTAL_DOMAIN + config.ODS_PORTAL_SUFFIX,
        port: config.ODS_PORTAL_PORT,
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
        config.ODS_PORTAL_PROTOCOL +
        '//' + config.ODS_PORTAL_DOMAIN +
        '.ods.com' +
        (config.ODS_PORTAL_PORT !== 80 ? ':' + config.ODS_PORTAL_PORT:'') +
        '/explore/?stage_theme=true');

});
