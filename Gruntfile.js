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
        },
        release: {
            options: {
                npm: false,
                npmtag: true
            }
        }
    });


    grunt.registerTask('default', [
        'jshint'
    ]);

};
