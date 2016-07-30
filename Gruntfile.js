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
                    './dist/_res/css/main.css': './src/_res/sass/main.scss'
                }
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
                        version: '<%= pkg.version =>'
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
    grunt.registerTask('dev', ['clean', 'sass:dev', 'targethtml:dev']);
    grunt.registerTask('prod', ['clean', 'sass:prod', 'targethtml:prod']);
};