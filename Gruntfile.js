'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: [
                '**/*.js',
                '!node_modules/**/*.js'
            ]
        },
        mochaTest: {
              test: {
                options: {
                  reporter: 'spec'
                },
                src: ['test/**/*.js']
              }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: ['pkg'],
                commitMessage: 'chore: release v%VERSION%',
                commitFiles: ['-a'],
                tagName: 'v%VERSION%',
                push: false
            }
        },
        changelog: {
            options: {
                editor: 'subl -w -n'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-conventional-changelog');

    grunt.registerTask('default', ['test']);
    grunt.registerTask('mocha', ['mochaTest']);
    grunt.registerTask('test', ['jshint', 'mocha']);

    // end-point tasks
    grunt.registerTask('release', function(version) {
        grunt.task.run([
            'test',
            'bump-only:' + ((version === undefined) ? 'patch' : version),
            'changelog',
            'bump-commit'
        ]);
    });
};
