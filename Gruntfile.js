//Gruntfile
module.exports = function(grunt) {

  //Initializing the configuration object
  grunt.initConfig({
    jst: {
      compile: {
        options: {
          prettify: false,
          amdWrapper: false,
          processName: function (filename) {
            var key = 'templates/';
            // src/templates/views/viewName.js -> views/viewName
            return filename.slice(filename.indexOf(key) + key.length, filename.lastIndexOf('.'));
          }
        },
        files: {
          "dist/templates.underscore.js": ["dev/templates/**/*.tpl"]
        }
      }
    },
    coffee: {
      exercices: {
        options: {
          bare:true,
          join:true
        },
        files: {
          'app/entities/exercices/exercices_controller.js': 'dev/coffee/entities/exercices/exercices_controller.coffee',
        }
      }
    },
    watch: {
        jst: {
            // Watch all .tpl files from the template directory)
            files: "dev/templates/**/*.tpl",
            tasks: ['jst'],
            // Reloads the browser
            options: {
              livereload: true
            }
        },
        coffee: {
            files: [ 'dev/coffee/**/*.coffee'],
            tasks: [ 'coffee' ],
            // Reloads the browser
            options: {
              livereload: true
            }
        }
    }
  });

  // Plugin loading
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jst');
  // Task definition
  grunt.registerTask('default', ['watch']);
};
