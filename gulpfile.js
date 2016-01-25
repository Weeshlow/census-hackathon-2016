( function() {

    'use strict';

    var gulp = require('gulp'),
        concat = require('gulp-concat'),
        _ = require('lodash'),
        runSequence,
        bower,
        csso,
        filter,
        uglify;

    var GO_PATH = process.env.GOPATH;
    var WATCHED_GO_LIBS = [
        'github.com/unchartedsoftware/prism',
        'github.com/unchartedsoftware/prism-server'
    ];
    var WATCHED_GO_PATHS = _.map( WATCHED_GO_LIBS, function(lib) {
        return GO_PATH + '/src/' + lib + '/**/*.go';
    });
    var PROJECT_NAME = 'census-hackathon-2016';
    var PUBLIC_DIR = './public/';
    var OUTPUT_DIR = './build/public/';
    var paths = {
        serverRoot: './main.go',
        webappRoot: PUBLIC_DIR + '/app.js',
        go: WATCHED_GO_PATHS.concat([ './**/*.go' ]),
        templates: [ PUBLIC_DIR + 'templates/**/*.hbs'],
        scripts: [ PUBLIC_DIR + 'scripts/**/*.js',  PUBLIC_DIR + 'app.js' ],
        styles: [  PUBLIC_DIR + 'styles/reset.css',  PUBLIC_DIR + 'styles/**/*.css' ],
        index: [  PUBLIC_DIR + 'index.html' ],
        resources: [
            PUBLIC_DIR + 'index.html',
            PUBLIC_DIR + 'shaders/*',
            PUBLIC_DIR + 'favicons/*',
            PUBLIC_DIR + 'images/*'
        ]
    };

    function handleError( err ) {
        console.log( err );
        this.emit( 'end' );
    }

    function bundle( bundler, watch ) {
        var source = require('vinyl-source-stream');
        if ( watch ) {
            var watchify = require('watchify');
            var watcher = watchify( bundler );
            watcher.on( 'update', function( ids ) {
                // When any files updates
                console.log('\nWatch detected changes to: ');
                for ( var i=0; i<ids.length; ids++ ) {
                   console.log( '\t'+ids[i] );
                }
                var updateStart = Date.now();
                watcher.bundle()
                    .on( 'error', handleError )
                    .pipe( source( PROJECT_NAME + '.js' ) )
                    // This is where you add uglifying etc.
                    .pipe( gulp.dest( OUTPUT_DIR ) );
                console.log( 'Updated in', ( Date.now() - updateStart ) + 'ms' );
            });
            bundler = watcher;
        }
        return bundler
            .bundle() // Create the initial bundle when starting the task
            .on( 'error', handleError )
            .pipe( source( PROJECT_NAME + '.js' ) )
            .pipe( gulp.dest( OUTPUT_DIR ) );
    }

    gulp.task('clean', function () {
        var del = require('del');
        del.sync([ OUTPUT_DIR + '/*']);
    });

    gulp.task('lint', function() {
        var jshint = require('gulp-jshint');
        return gulp.src( [ PUBLIC_DIR + '/**/*.js',
            '!'+PUBLIC_DIR+'/extern/**/*.js'] )
            .pipe( jshint() )
            .pipe( jshint('.jshintrc') )
            .pipe( jshint.reporter('jshint-stylish') );
    });

    gulp.task('build-and-watch-scripts', function() {
        var browserify = require('browserify'),
            bundler = browserify( paths.webappRoot, {
                debug: true,
                standalone: PROJECT_NAME
            });
        return bundle( bundler, true );
    });

    gulp.task('build-scripts', function() {
        var browserify = require('browserify'),
            bundler = browserify( paths.webappRoot, {
                debug: true,
                standalone: PROJECT_NAME
            });
        return bundle( bundler, false );
    });

    gulp.task('build-templates',function() {
        var handlebars = require('gulp-handlebars');
        var wrap = require('gulp-wrap');
        var declare = require('gulp-declare');
        return gulp.src( paths.templates )
            .pipe( handlebars({
                // Pass your local handlebars version
                handlebars: require('handlebars')
            }))
            .pipe( wrap('Handlebars.template(<%= contents %>)'))
            .pipe(declare({
                namespace: 'Templates',
                noRedeclare: true, // avoid duplicate declarations
            }))
            .pipe( concat( PROJECT_NAME + '.templates.js' ) )
            .pipe( gulp.dest( OUTPUT_DIR ) );
    });

    gulp.task('build-styles', function () {
        csso = csso || require('gulp-csso');
        var concat = require('gulp-concat');
        return gulp.src( paths.styles )
            .pipe( csso() )
            .pipe( concat( PROJECT_NAME + '.css') )
            .pipe( gulp.dest( OUTPUT_DIR ) );
    });

    gulp.task('copy-resources', function() {
        return gulp.src( paths.resources, {
                base: PUBLIC_DIR
            })
            .pipe( gulp.dest( OUTPUT_DIR ) );
    });

    gulp.task('build-vendor-js', function() {
        filter = filter || require('gulp-filter');
        bower = bower || require('main-bower-files');
        uglify = uglify || require('gulp-uglify');
        return gulp.src( bower() )
            .pipe( filter('**/*.js') ) // filter js files
            .pipe( concat('vendor.min.js') )
            .pipe( uglify() )
            .pipe( gulp.dest( OUTPUT_DIR ) );
    });

    gulp.task('build-vendor-css', function() {
        filter = filter || require('gulp-filter');
        bower = bower || require('main-bower-files');
        csso = csso || require('gulp-csso');
        return gulp.src( bower() )
            .pipe( filter('**/*.css') ) // filter css files
            .pipe( csso() )
            .pipe( concat('vendor.min.css') )
            .pipe( gulp.dest( OUTPUT_DIR ) );
    });

    gulp.task('build-vendor', function( done ) {
        runSequence = runSequence || require('run-sequence');
        runSequence([
            'build-vendor-js',
            'build-vendor-css' ],
            done );
    });

    gulp.task('build', function( done ) {
        runSequence = runSequence || require('run-sequence');
        runSequence(
            [ 'clean', 'lint' ],
            [ 'build-and-watch-scripts', 'build-templates', 'build-styles', 'build-vendor', 'copy-resources' ],
            done );
    });

    gulp.task('deploy', function( done ) {
        runSequence = runSequence || require('run-sequence');
        runSequence(
            [ 'clean', 'lint' ],
            [ 'build-scripts', 'build-templates', 'build-styles', 'build-vendor', 'copy-resources' ],
            done );
    });

    var go;
    gulp.task('serve', function() {
        var gulpgo = require( 'gulp-go' );
        go = gulpgo.run( paths.serverRoot, [
            '-public', '/*=./build/public',
            '-alias', 'development=http://192.168.0.41:9200',
            '-alias', 'production=http://10.65.16.13:9200',
            '-alias', 'openstack=http://10.64.16.120:9200',
            '-alias', 'redis_local=localhost:6379'
        ], {
            cwd: __dirname,
            stdio: 'inherit'
        });
    });

    gulp.task('watch', [ 'build' ], function( done ) {
        gulp.watch( paths.go ).on('change', function() {
            go.restart();
        });
        gulp.watch( paths.styles, [ 'build-styles' ] );
        gulp.watch( paths.templates, [ 'build-templates' ]);
        gulp.watch( paths.resources, [ 'copy-resources' ] );
        done();
    });

    gulp.task('default', [ 'watch', 'serve' ], function() {
    });

}());
