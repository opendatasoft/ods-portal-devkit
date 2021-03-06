var gulp = require('gulp');
var http = require('http');
var https = require('https');
var through2 = require('through2');
var yargs = require('yargs');
var argv = yargs.argv;

var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

var config = require('./config');

gulp.task('default', ['help']);

gulp.task('help', function() {
    console.log('Available commands:');
    console.log('   - push: compile the current stylesheet and pushes it as a staged theme on the portal.');
    console.log('   - watch: runs a compile and push every time a stylesheet file changes.');
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
        .pipe(through2.obj(function(file, enc, cb) {
            // Prepare the payload
            var css = file.contents.toString();

            var payload = {
                'stylesheet': css
            };

            var body = JSON.stringify(payload);
            var options = {
                host: config.ODS_PORTAL_DOMAIN + config.ODS_PORTAL_SUFFIX,
                port: config.ODS_PORTAL_PORT,
                method: 'POST',
                path: '/api/management/1.0/domain_theme/?themeapikey=' + config.ODS_THEME_APIKEY,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': body.length
                }
            };
            if (config.ODS_USERNAME && config.ODS_PASSWORD) {
                options['auth'] = config.ODS_USERNAME + ':' + config.ODS_PASSWORD;
            }
            var responseHandler = function (response) {
                if (response.statusCode === 401) {
                    console.log('Authentication failure when pushing your changes. Maybe your API key is not valid?');
                } else if (response.statusCode !== 200) {
                    console.log('Error when pushing your changes. Status: ' + response.statusCode + ', Message: ' + response.statusMessage);
                } else {
                    console.log('Your changes have been pushed and can be browsed:',
                        config.ODS_PORTAL_PROTOCOL + '://' + config.ODS_PORTAL_DOMAIN + config.ODS_PORTAL_SUFFIX +
                        (config.ODS_PORTAL_PROTOCOL !== 'https' || config.ODS_PORTAL_PORT !== 443 ? ':' + config.ODS_PORTAL_PORT : '') +
                        '/explore/?stage_theme=true&themeapikey=' + config.ODS_THEME_APIKEY);
                }
            };
            var req;
            if (config.ODS_PORTAL_PROTOCOL === 'http') {
                req = http.request(options, responseHandler);
            } else {
                req = https.request(options, responseHandler);
            }

            req.write(body);
            req.end();
        }));
});
