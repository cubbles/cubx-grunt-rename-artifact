'use strict';
module.exports = function (grunt) {
  // measures the time each task takes
  require('time-grunt')(grunt);

  // Load the plugin that provides tasks.
  require('load-grunt-tasks')(grunt);

  // Load grunt configurations
  const options = {
    githooks: {
      all: {
        'pre-commit': 'shell:eslint'
      }
    },
    shell: {
      eslint: {
        command: 'npm run-script lint'
      },
      test: {
        command: 'npm test'
      }
    }
  };
  // Define the configuration for all the tasks
  grunt.initConfig(options);

  // Default server test task.
  grunt.registerTask('default', [
    'githooks'
  ]);

  // Default client test task.
  grunt.registerTask('test', [
    'shell:eslint', 'shell:test'
  ]);
  // Default client test task.
  grunt.registerTask('validateSources', [
    'shell:eslint'
  ]);
};
