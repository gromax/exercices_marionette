//Gruntfile
module.exports = function(grunt) {

  //Initializing the configuration object
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      main: {
        files: {
          'dist/main.<%= grunt.file.readJSON("package.json").version %>.min.js': 'dist/main.js',
        }
      }
    },

    'string-replace': {
      index: {
        files: {
          'index.html' : 'dev/index.src'
        },
        options: {
          replacements: [{
            pattern: '<script data-main="./dist/main.min.js" src="./vendor/requirejs/require.js"></script>',
            replacement: "<script data-main=\"./dist/main.<%= grunt.file.readJSON('package.json').version %>.min.js\" src=\"./vendor/requirejs/require.js\"></script>"
          }]
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
      entities: {
        options: {
          bare: true
        },
        files:[{
            expand: true,     // Enable dynamic expansion.
            cwd: 'dev/coffee/entities',      // Src matches are relative to this path.
            src: ['**/*.coffee'], // Actual pattern(s) to match.
            dest: 'app/entities/',   // Destination path prefix.
            ext: '.js',   // Dest filepaths will have this extension.
            extDot: 'first'   // Extensions in filenames begin after the first dot
        }]
      },

      utils: {
        options: {
          bare:true,
        },
        files: {
          'app/utils/help.js' : 'dev/coffee/utils/help.coffee',
          'app/utils/colors.js' : 'dev/coffee/utils/colors.coffee',
          'app/utils/tab.js' : 'dev/coffee/utils/tab.coffee',
          'app/utils/svg.add.js' : 'dev/coffee/utils/svg.add.coffee',
        }
      },

      apps:{
        options: {
          bare: true
        },
        files: [
          {
            expand: true,     // Enable dynamic expansion.
            cwd: 'dev/coffee/apps',      // Src matches are relative to this path.
            src: ['**/*.coffee'], // Actual pattern(s) to match.
            dest: 'app/apps/',   // Destination path prefix.
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
            'dev/coffee/math/numbers/symbolmanager.coffee',
            'dev/coffee/math/numbers/mathobject.coffee',
            'dev/coffee/math/numbers/numberobject.coffee',
            'dev/coffee/math/numbers/plusnumber.coffee',
            'dev/coffee/math/numbers/multiplynumber.coffee',
            'dev/coffee/math/numbers/powernumber.coffee',
            'dev/coffee/math/numbers/monome.coffee',
            'dev/coffee/math/numbers/functionnumber.coffee',
            'dev/coffee/math/numbers/simplenumber.coffee',
            'dev/coffee/math/numbers/inftynumber.coffee',
            'dev/coffee/math/numbers/rationalnumber.coffee',
            'dev/coffee/math/numbers/radicalnumber.coffee',
            'dev/coffee/math/numbers/floatnumber.coffee',
            'dev/coffee/math/numbers/realnumber.coffee',
            'dev/coffee/math/numbers/complexenumber.coffee',
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

    version: {
      project: {
        src: ['package.json', 'app/app.js']
      }
    },

    shell: {
      r: {
        command: "r.js -o build.js"
      }
    },

    watch: {
        jst: {
            // Watch all .tpl files from the template directory)
            files: "dev/templates/**/*.tpl",
            tasks: [ 'jst' ],
            // Reloads the browser
            options: {
              livereload: true
            }
        },
        math: {
            files: [ 'dev/coffee/math/**/*.coffee'],
            tasks: [ 'coffee:math' ],
            // Reloads the browser
            options: {
              livereload: true
            }
        },
        utils: {
            files: [ 'dev/coffee/utils/**/*.coffee'],
            tasks: [ 'coffee:utils' ],
            // Reloads the browser
            options: {
              livereload: true
            }
        },
        apps: {
            files: [ 'dev/coffee/apps/**/*.coffee'],
            tasks: [ 'coffee:apps' ],
            // Reloads the browser
            options: {
              livereload: true
            }
        },
        entities: {
            files: [ 'dev/coffee/entities/**/*.coffee'],
            tasks: [ 'coffee:entities' ],
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
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-shell');

  // Task definition
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('prod',["string-replace:index", "shell:r", "uglify"]);
  grunt.registerTask('minor',["version:project:minor", "string-replace:index", "shell:r", "uglify"]);
  grunt.registerTask('patch',["version:project:patch", "string-replace:index", "shell:r", "uglify"]);
};

