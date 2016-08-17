/*
 * grunt-img-md5
 * https://github.com/xyc-cn/grunt-img-md5
 *
 * Copyright (c) 2016 easonxie
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['test/release']
    },

    // Configuration to be run (and then tested).
    img_md5: {
      html: {
        options: {
          Base:'test/src/html/',
          Target:"test/release/html/", 
          RegExp:[{RegExp:/(data-url)\s*=\s*["']([^<">']+?\.(jpg|png|gif))/g,index:2}],
          md5Length:8
        },
        files: {
          'test/src/html/': 'test/src/html/**/*.html'
        },
         map: function(filename){ 
          var newfilename = filename.replace('src/html/',"release/html/");
          return newfilename;
        }
      },
      css: {
        options: {
          Base:'test/src/css/', 
          Target:"test/release/css/"
        },
        files: {
          'test/src/css/': 'test/src/css/*.css'
        },
         map: function(filename){ 
          var newfilename = filename.replace('src/css/',"release/css/");
          return newfilename;
        }
      },
      js:{
        options:{
          BaseMap: function (v) {
            return path.join('test/src/js/',v);
          },
          TargetMap:function (v) {
            return path.join('test/release/js/',v);
          }
        },
        files: {
          'test/src/js/': 'test/src/js/**/*.js'
        },
        map: function(filename){
          var newfilename = filename.replace('test/src/js/',"test/release/js/");
          return newfilename;
        }
      }
    }


  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');


  grunt.registerTask('default', ['clean', 'img_md5']);


};
