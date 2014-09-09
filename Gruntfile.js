/*
* grunt-contrib-coffee
* http://gruntjs.com/
*
* Copyright (c) 2014 Eric Woroshow, contributors
* Licensed under the MIT license.
*/
'use strict';
module.exports = function(grunt) {
	var mixedConcatFixtures = [
		'test/fixtures/coffee1.coffee',
		'test/fixtures/coffee2.coffee',
		'test/fixtures/litcoffee.litcoffee'
	];
	
	var uniformConcatFixtures = [
		'test/fixtures/coffee1.coffee',
		'test/fixtures/coffee2.coffee'
	];
	
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
			tests: ['tmp/bare', 'tmp/default', 'tmp/join', 'tmp/sourceMapDir1', 'tmp/sourceMapDir2', 'tmp/nest']
		},

		// Configuration to be run (and then tested).
		coffee: {
			build: {

				expand: true,
				flatten: true,
				cwd: 'src/',
				src: ['*.coffee'],
				dest: 'build',
				ext: '.js'
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		}
	});


	// Actually load this plugin's task(s).
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadTasks('tasks');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['jshint', 'clean', 'coffee', 'nodeunit']);
	
	// By default, lint and run all tests.
	grunt.registerTask('default', ['coffee']);
};
