//Gruntfile
module.exports = function(grunt) {

  //Initializing the configuration object
  grunt.initConfig({
    uglify: {
      main: {
        files: {
          'dist/main.min.js': 'dist/main.js',
        }
      }
    },

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
          "app/templates.underscore.js": ["dev/templates/**/*.tpl"]
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
          'app/entities/exercice.js' : 'dev/coffee/entities/exercice.coffee',
          'app/entities/exercices.js' : 'dev/coffee/entities/exercices.coffee',
          'app/utils/help.js' : 'dev/coffee/utils/help.coffee',
          'app/utils/colors.js' : 'dev/coffee/utils/colors.coffee',
          'app/utils/svg.js' : 'dev/coffee/utils/svg.coffee',
          'app/utils/tab.js' : 'dev/coffee/utils/tab.coffee',
        }
      },

      exofiles: {
        options: {
          bare:true,
        },
        files:[
          {
            expand: true,     // Enable dynamic expansion.
            cwd: 'dev/coffee/entities/exercices',      // Src matches are relative to this path.
            src: ['**/*.coffee'], // Actual pattern(s) to match.
            dest: 'app/entities/exercices/',   // Destination path prefix.
            ext: '.js',   // Dest filepaths will have this extension.
            extDot: 'first'   // Extensions in filenames begin after the first dot
          },
        ]
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
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Task definition
  grunt.registerTask('default', ['watch']);
};

