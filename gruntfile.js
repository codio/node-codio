(function() {
  module.exports = function(grunt) {
    grunt.initConfig({
      jshint: {
        all: {
          src: ['index.js', 'lib/**/*.js', 'test/**/*.js', '!lib/ns/gunzip.js']
        },
        options: {
          jshintrc: '.jshintrc'
        }
      },
      simplemocha: {
        options: {
          ui: 'bdd',
          reporter: 'spec'
        },
        all: {
          src: ['test/mocha-globals.js', 'test/**/*.spec.js']
        }
      },
      watch: {
        all: {
          files: ['lib/**/*.js', 'test/**/*.*'],
          tasks: ['test', 'notify:test']
        }
      },
      notify: {
        test: {
          options: {
            message: 'Test run successfull'
          }
        }
      }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');
    grunt.registerTask('test', ['simplemocha:all']);
    return grunt.registerTask('default', ['jshint']);
  };

}).call(this);
