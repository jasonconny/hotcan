module.exports = function(grunt) {
  grunt.initConfig({
     pkg: grunt.file.readJSON('package.json'),
     sass: {
         dist: {
             options: {
                 "style" : "expanded",
                 "sourcemap" : "inline",
                 "unixNewlines" : true,
                 "noCache" : true
             },
             files: {
                 'app/_res/css/main.css': 'app/_res/sass/main.scss'
             }
         }
     },
      watch: {
          css: {
              files: '**/*.scss',
              tasks: ['sass'],
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
      }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
};