module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            local: {
                options: {
                    "style" : "expanded",
                    "sourcemap" : true,
                    "unixNewlines" : true,
                    "noCache" : true
                },
                files: {
                    './src/_res/css/main.css': './src/_res/sass/main.scss'
                }
            },
            dev: {
                options: {
                    "style" : "expanded",
                    "sourceMap" : true,
                    "unixNewlines" : true,
                    "noCache" : true
                },
                files: {
                    './dist/_res/css/main.css': './src/_res/sass/main.scss'
                }
            },
            prod: {
                options: {
                    "style" : "compressed",
                    "sourcemap" : false,
                    "unixNewlines" : true,
                    "noCache" : true
                },
                files: {
                    './dist/_res/css/main.min.css': './src/_res/sass/main.scss'
                }
            }
        },
        uglify: {
            options: {
                mangle: false,
                compress: true
            },
            my_target: {
                files: {
                    './src/_res/js/app.min.js' : ['./src/_res/js/app.js']
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                      '**/angular.min.js'
                    , '**/angular-ui-router.min.js'
                    , '**/angular-animate.min.js'
                    , '**/lodash.min.js'
                    , '**/app.min.js'
                ],
                dest: './dist/_res/js/<%= pkg.name %>.min.js'
            }
        },
        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass:local'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: '**/*.js',
                options: {
                    livereload: true
                }
            },
            html: {
                files: '**/*.html',
                options: {
                    livereload: true
                }
            }
        },
        clean: {
            dist: ['./dist/*']
        },
        copy: {
            dev: {
                expand: true,
                cwd: './src/',
                src: ['**/*', '.htaccess', '!**/audio/**', '!**/css/**', '!**/sass/**'],
                dest: './dist/'
            },
            prod: {
                expand: true,
                cwd: './src/',
                src: ['**/*', '.htaccess', '!**/audio/**', '!**/css/**', '!**/sass/**', '!**/js/**'],
                dest: './dist/'
            },
            jsMaps: {
                expand: true,
                flatten: true,
                cwd: './src/_res/js/',
                src: ['**/*.js.map'],
                dest: './dist/_res/js/'
            }
        },
        targethtml: {
            dev: {
                options: {
                    curlyTags: {
                        version: '<%= pkg.version %>'
                    }
                },
                files: {
                    './dist/index.html' : './src/index.html'
                }
            },
            prod: {
                options: {
                    curlyTags: {
                        version: '<%= pkg.version %>'
                    }
                },
                files: {
                    './dist/index.html' : './src/index.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-targethtml');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('dev', ['clean', 'uglify', 'copy:dev', 'sass:dev', 'targethtml:dev']);
    grunt.registerTask('prod', ['clean', 'copy:prod', 'copy:jsMaps', 'sass:prod', 'uglify', 'concat', 'targethtml:prod']);
};