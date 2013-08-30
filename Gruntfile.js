/*global require, module */

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'lodash'

module.exports = function (grunt) {
    'use strict';
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var scyllaConfig = {
        api: 'api',
        frontend: 'public'
    };

    grunt.initConfig({
        scylla: scyllaConfig,
        watch: {
            test: {
                files:[
                    'test/**/*.js'
                ],
                tasks: ['mocha']
            },
            livereload: {
                files: [
                    '<%= scylla.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    'test/**/*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
                ],
                tasks: ['livereload']
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= scylla.api %>/{,*/}*.js',
                '<%= scylla.frontend %>/app/{,*/}*.js',
                'test/spec/{,*/}*.js'
            ]
        }
    });


    grunt.registerTask('default', [
        'jshint'
    ]);

};
