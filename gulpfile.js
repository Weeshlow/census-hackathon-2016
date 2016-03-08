( function() {

    'use strict';

    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var source = require('vinyl-source-stream');
    var handlebars = require('gulp-handlebars');
    var wrap = require('gulp-wrap');
    var declare = require('gulp-declare');
    var watchify = require('watchify');
    var del = require('del');
    var jshint = require('gulp-jshint');
    var csso = require('gulp-csso');
    var runSequence = require('run-sequence');
    var gulpgo = require( 'gulp-go' );
    var filter = require('gulp-filter');
    var bower = require('main-bower-files');
    var uglify = require('gulp-uglify');
    var browserify = require('browserify');

    var GO_PATH = process.env.GOPATH;
    var WATCHED_GO_LIBS = [
        'github.com/unchartedsoftware/prism',
        'github.com/unchartedsoftware/prism-server'
    ];
    var WATCHED_GO_PATHS = WATCHED_GO_LIBS.map( function(lib) {
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
        if ( watch ) {
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
        del.sync([ OUTPUT_DIR ]);
    });

    gulp.task('lint', function() {
        return gulp.src( [ PUBLIC_DIR + '/**/*.js',
            '!'+PUBLIC_DIR+'/extern/**/*.js'] )
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
        var bundler = browserify( paths.webappRoot, {
            debug: true,
            standalone: PROJECT_NAME
        });
        return bundle( bundler, false );
    });

    gulp.task('build-templates',function() {
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
        return gulp.src( bower() )
            .pipe( filter('**/*.js') ) // filter js files
            .pipe( concat('vendor.min.js') )
            .pipe( uglify() )
            .pipe( gulp.dest( OUTPUT_DIR ) );
    });

    gulp.task('build-vendor-css', function() {
        return gulp.src( bower() )
            .pipe( filter('**/*.css') ) // filter css files
            .pipe( csso() )
            .pipe( concat('vendor.min.css') )
            .pipe( gulp.dest( OUTPUT_DIR ) );
    });

    gulp.task('build-vendor', function( done ) {
        runSequence([
            'build-vendor-js',
            'build-vendor-css' ],
            done );
    });

    gulp.task('build', function( done ) {
        runSequence(
            [ 'clean', 'lint' ],
            [ 'build-and-watch-scripts', 'build-templates', 'build-styles', 'build-vendor', 'copy-resources' ],
            done );
    });

    gulp.task('deploy', function( done ) {
        runSequence(
            [ 'clean', 'lint' ],
            [ 'build-scripts', 'build-templates', 'build-styles', 'build-vendor', 'copy-resources' ],
            done );
    });

    var go;
    gulp.task('serve', function() {
        go = gulpgo.run( paths.serverRoot, [], {
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
