/*
 * grunt-img-md5
 * https://github.com/Administrator/grunt-img-md5
 *
 * Copyright (c) 2016 easonxie
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    img_md5: {
      html: {
        options: {
          Base:'test/src/html/', //会根据path.join(Base,匹配出来的图片url) 来确定源图片文件的url
          Target:"test/release/html/", //会根据path.join(Base,匹配出来的图片url) 来确定新图片文件的url
          RegExp:[/data-url\s*=\s*["']([^<">']+?\.(jpg|png|gif))/g] //额外的正则表达式匹配，期望返回类似"../img/a.png"类的结果
        },
        files: {
          'test/src/html/': 'test/src/html/*.html'
        },
         map: function(filename){ 
          var newfilename = filename.replace('src/html/',"release/html/");
          return newfilename;
        }
      },
      css: {
        options: {
          Base:'test/src/css/', //会根据path.join(Base,匹配出来的图片url) 来确定源图片文件的url
          Target:"test/release/css/", //会根据path.join(Base,匹配出来的图片url) 来确定新图片文件的url
        },
        files: {
          'test/src/css/': 'test/src/css/*.css'
        },
         map: function(filename){ 
          var newfilename = filename.replace('src/css/',"release/css/");
          return newfilename;
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'img_md5', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['img_md5']);

};
