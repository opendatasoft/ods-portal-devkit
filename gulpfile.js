var gulp = require('gulp');
var http = require('http');
var fs = require('fs');
var through2 = require('through2');
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
    gulp.watch(argv.lesswatchdir || config.ODS_DEFAULT_LESS_WATCH_DIR, ['push']);
});

gulp.task('push', function() {
    // Compile the LESS files into a single CSS file, push it to the remote
    // API.
    gulp.src(argv.lessfile || config.ODS_DEFAULT_LESS_FILE)
        .pipe(less())
        .pipe(autoprefixer())
        //.pipe(gulp.dest('build'))
        .pipe(through2.obj(function(file, enc, cb) {
            // Prepare the payload
            var css = file.contents.toString();
            console.log(css);
            var payload = {
                'stylesheet': css
            };

            var body = JSON.stringify(payload);
            var req = http.request({
                protocol: config.ODS_PORTAL_PROTOCOL,
                host: config.ODS_PORTAL_DOMAIN + config.ODS_PORTAL_SUFFIX,
                port: config.ODS_PORTAL_PORT,
                method: 'POST',
                path: '/api/management/1.0/domain_theme/?themeapikey='+config.ODS_THEME_APIKEY,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': body.length
                },
                auth: config.ODS_USERNAME + ':' + config.ODS_PASSWORD
            }, function(res) {
                if (res.statusCode === 401) {
                    console.log('Authentication failure when pushing your changes. Maybe your API key is not valid?');
                } else if (res.statusCode !== 200) {
                    console.log('Error when pushing your changes. Status: '+res.statusCode+', Message: '+statusMessage);
                } else {
                    console.log('Your changes have been pushed and can be browsed:',
                        config.ODS_PORTAL_PROTOCOL +
                        '//' + config.ODS_PORTAL_DOMAIN +
                        '.ods.com' +
                        (config.ODS_PORTAL_PORT !== 80 ? ':' + config.ODS_PORTAL_PORT:'') +
                        '/explore/?stage_theme=true');
                }
            });

            req.write(body);
            req.end();
        }));
});
