'use strict'

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  const serveStatic = require('serve-static')
  const config = {
    app: 'app',
    dist: 'dist'
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: config,

    browserify: {
      dist: {
        files: {
          '<%= config.dist %>/scripts/app.js': ['<%= config.app %>/scripts/**/*.js']
        },
        options: {
          browserifyOptions: {
            debug: true
          },
          transform: [
            'browserify-shim',
            'hbsfy',
            'babelify',
            'uglifyify'
          ]
        }
      }
    },

    clean: {
      dist: ['<%= config.dist %>']
    },

    connect: {
      dist: {
        options: {
          port: 8080,
          hostname: '0.0.0.0',
          livereload: true,
          base: '<%= config.dist %>',
          open: true,
          middleware: function(connect, options) {
            const middlewares = []
            if (!Array.isArray(options.base)) {
              options.base = [options.base]
            }
            const directory = options.directory || options.base[options.base.length - 1]
            options.base.forEach(function(base) {
              middlewares.push(serveStatic(base))
            })
            middlewares.push(serveStatic(directory))
            middlewares.push(function(req, res) {
              for (let file, i = 0; i < options.base.length; i++) {
                file = options.base + "/index.html"
                if (grunt.file.exists(file)) {
                  require('fs').createReadStream(file).pipe(res)
                  return
                }
              }
              res.statusCode(404)
              res.end()
            })
            return middlewares
          }
        }
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/bootstrap/dist',
            src: ['fonts/**'],
            dest: '<%= config.dist %>'
          },
          {
            expand: true,
            cwd: '<%= config.app %>',
            src: ['**/*.html'],
            dest: '<%= config.dist %>'
          },
          {
            expand: true,
            cwd: '<%= config.app %>',
            src: ['styles/**/*.css'],
            dest: '<%= config.dist %>'
          },
          {
            expand: true,
            cwd: '<%= config.app %>',
            src: ['icons/**/*'],
            dest: '<%= config.dist %>'
          },
          {
            expand: true,
            cwd: '<%= config.app %>',
            src: ['images/**/*{.png,.gif,.jpg}'],
            dest: '<%= config.dist %>'
          }
        ]
      }
    },

    eslint: {
      target: ['<%= config.app %>/scripts/*.js']
    },

    sass: {
      dist: {
        options: {
          style: 'compressed',
          unixNewlines: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.app %>/styles',
            src: ['*.scss'],
            dest: '<%= config.dist %>/styles/',
            ext: '.css'
          }
        ]
      }
    },

    watch: {
      options: {
        livereload: true
      },
      documents: {
        files: ['<%= config.app %>/**/*.html'],
        tasks: ['copy']
      },
      icons: {
        files: ['<%= config.app %>/icons/**/*'],
        tasks: ['copy']
      },
      images: {
        files: ['<%= config.app %>/images/**/*{.png,.gif,.jpg}'],
        tasks: ['copy']
      },
      scripts: {
        files: ['<%= config.app %>/scripts/**/*.js'],
        tasks: ['eslint', 'browserify']
      },
      templates: {
        files: ['<%= config.app %>/scripts/templates/**/*.hbs'],
        tasks: ['browserify']
      },
      styles: {
        files: ['<%= config.app %>/styles/*.scss'],
        tasks: ['sass']
      },
      gruntfile: {
        files: ['Gruntfile.js', 'package.json']
      }
    }

  })

  grunt.registerTask('default', [
      'eslint',
      'clean',
      'copy',
      'sass',
      'browserify',
      'connect',
      'watch'
    ]
  )

}
