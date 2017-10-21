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
          'app/entities/exercices/exercices_catalog.js' : 'dev/coffee/entities/exercices/exercices_catalog.coffee',
          'app/entities/exercice.js' : 'dev/coffee/entities/exercice.coffee',
          'app/entities/exercices.js' : 'dev/coffee/entities/exercices.coffee',
          'app/utils/help.js' : 'dev/coffee/utils/help.coffee',
          'app/entities/exercices/exo0002.js' : 'dev/coffee/entities/exercices/exo0002.coffee'
        }
      },

      math: {
        options: {
          bare:false,
          join:true
        },
        files: {
          'app/utils/math.js': [
            'dev/coffee/math/header.coffee',
            'dev/coffee/math/functions.coffee',
            'dev/coffee/math/math.coffee',
            'dev/coffee/math/ensembleObject.coffee',
            'dev/coffee/math/tokens.coffee',
            'dev/coffee/math/parser.coffee',
            'dev/coffee/math/polynome.coffee',
            'dev/coffee/math/geometrie.coffee',
            'dev/coffee/math/proba.coffee',
            'dev/coffee/math/Stats.coffee',
            'dev/coffee/math/suite.coffee',
            'dev/coffee/math/trigo.coffee',
            'dev/coffee/math/erreur.coffee',
            'dev/coffee/math/myMath.coffee',
            'dev/coffee/math/footer.coffee',
          ]
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
