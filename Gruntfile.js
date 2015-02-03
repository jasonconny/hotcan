module.exports = function(grunt) {
  grunt.initConfig({
     pkg: grunt.file.readJSON('package.json'),
     sass: {
         dist: {
             options: {
                 sourcemap: 'inline',
                 noCache: true
             },
             files: {
                 'app/_res/css/main.css': 'app/_res/sass/main.scss'
             }
         }
     },
      watch: {
          css: {
              files: '**/*.scss',
              tasks: ['sass']
          }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['sass']);
};