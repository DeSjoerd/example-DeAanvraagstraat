

// gulpfile
// based on the gulpfile of johnpapa/gulp-patterns:
// https://github.com/johnpapa/gulp-patterns/blob/master/gulpfile.js

var $ = require('gulp-load-plugins')({ lazy: true });
var args = require('yargs')
    .count('verbose')
    .alias('v', 'verbose')
    .argv;
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var _ = require('lodash');



var tmpFolder = "./.tmp/";
var buildFolder = "./build/";

var config = {
    temp: tmpFolder,
    build: buildFolder,

    index: './index.html',
    htmltemplates: './app/**/*.html',
    js: "./app/**/*.js",

    images: './src/assets/img/**/*.*',
    fonts: './src/assets/fonts/**/*.*',
    libfonts: './content/fonts/**/*.*',

    templateCache: {
        file: 'templates.js',
        module: 'straat.app',
        root: 'app/',
        standalone: false,
        path: tmpFolder
    }
};

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function () {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.bytediff.start())
        .pipe($.minifyHtml({ empty: true }))
        .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
        .pipe($.angularTemplatecache(config.templateCache.file, {
            module: config.templateCache.module,
            standalone: config.templateCache.standAlone,
            root: config.templateCache.root
        }))
        .pipe(gulp.dest(config.templateCache.path));
});

gulp.task('lib-fonts', ['clean-fonts'], function () {
    log('Copying fonts');
    return gulp.src(config.libfonts)
        .pipe(gulp.dest(config.build + 'content/fonts/'));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', ['clean-fonts', 'lib-fonts'], function () {
    log('Copying fonts');
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.build + 'assets/fonts/'));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], function () {
    log('Compressing and copying images');
    return gulp.src(config.images)
        .pipe($.imagemin({
            optimizationLevel: 3
        }))
        .pipe(gulp.dest(config.build + 'assets/img/'));
});

/**
 * Build everything
 , 'js-helpers'
 */
gulp.task('build', ['html', 'images', 'fonts'], function () {
    log('Building everything');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Deployed to the build folder',
    };
    del(config.temp);
    log(msg);
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('html', ['clean-styles', 'templatecache'], function () {
    log('Optimizing the js, css and html');

    var assets = $.useref.assets({ searchPath: ['./src/', './'] });

    // Filters are named for the gulp-useref path
    var cssAllFilter = $.filter('**/*.css');
    var jsFilter = $.filter('**/app.js');
    var jslibFilter = $.filter('**/vendor.js');

    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(templateCache, { read: false }), {
            starttag: '<!-- inject:templates:js -->'
        }))
        .pipe(assets) // Gather all assets from the html with useref;

        // get the css
        .pipe(cssAllFilter)
        .pipe($.autoprefixer())
        .pipe($.csso())
        .pipe(cssAllFilter.restore())

        // get the app javascript
        .pipe(jsFilter)
        .pipe($.ngAnnotate({ add: true }))
        .pipe($.uglify())
        .pipe(getHeader())
        .pipe(jsFilter.restore())

        // get the vendor javascript
        .pipe(jslibFilter)
        .pipe($.uglify())
        .pipe(jslibFilter.restore())

        // cache bust the js, css and html
        .pipe($.rev())
        // Apply the concat and file replacement with useref
        .pipe(assets.restore())
        .pipe($.useref())
        // replace the file names in the html with the cache busted rev numbers
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build));
});

/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function (done) {
    var delconfig = [].concat(config.build, config.temp);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-report', function (done) {
    var files = [].concat(config.report);
    clean(files, done);
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function (done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + 'js/**/*.js',
        config.build + '**/*.html'
    );
    clean(files, done);
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', function (done) {
    clean([].concat(config.build + 'assets/fonts/**/*.*'), done);
});

/**
 * Remove all images from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', function (done) {
    clean([].concat(config.build + 'assets/img/**/*.*'), done);
});

/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', function (done) {
    var files = [].concat(
        config.temp + '**/*.css',
        config.build + 'assets/css/**/*.css'
    );
    clean(files, done);
});


/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
    var pkg = require('./package.json');
    var template = [
        '/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @authors <%= pkg.authors %>',
        ' * @version v<%= pkg.version %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');
    return $.header(template, {
        pkg: pkg
    });
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
