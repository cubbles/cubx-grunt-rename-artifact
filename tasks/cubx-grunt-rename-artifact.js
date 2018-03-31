'use strict';
var inquirer = require('inquirer');
var ArtifactRenamer = require('cubx-prepare-webpackage-release');

module.exports = function (grunt) {
  grunt.registerTask('_webpackage-prepareRelease', 'Prepare the release of a webpackage', function () {
    var webpackagePath = grunt.config.get('param.src');

    if (!webpackagePath) {
      webpackagePath = grunt.config.get('webpackagepath');
    }
    if (!webpackagePath) {
      throw new Error('webpackagePath missed. Please defined the option webpackagePath.');
    }
    var wpReleasePreparer = new ArtifactRenamer(webpackagePath);
    var currentVersion = wpReleasePreparer.getCurrentVersion();
    var defaultReleaseV = wpReleasePreparer.isValidReleaseVersion(currentVersion)
      ? currentVersion : wpReleasePreparer.getDefaultReleaseVersion(currentVersion);

    var options = {
      questions: [
        {
          name: 'releaseVersion',
          type: 'input',
          message: 'Please type the release version to be set to the webpackage:',
          validate: function (input) {
            if (!wpReleasePreparer.isValidReleaseVersion(input)) {
              throw new Error('Invalid releaseVersion. (' + input + ') Please provide a valid release version ' +
                'e.g. \'1.0.0\' or \'2.0\'.');
            }
            return true;
          },
          default: defaultReleaseV
        }
      ]
    };

    var done = this.async();
    inquirer.prompt(options.questions).then(function (result) {
      // prepareRelease
      wpReleasePreparer.setReleaseVersion(result.releaseVersion);
      wpReleasePreparer.prepareUpload();
      done();
    });
  });
  grunt.registerTask('_webpackage-updateToNextVersion', 'Update manifest to next development version', function () {
    var webpackagePath = grunt.config.get('param.src');

    if (!webpackagePath) {
      webpackagePath = grunt.config.get('webpackagepath');
    }
    if (!webpackagePath) {
      throw new Error('webpackagePath missed. Please defined the option webpackagePath.');
    }
    var wpReleasePreparer = new ArtifactRenamer(webpackagePath);
    var currentVersion = wpReleasePreparer.getCurrentVersion();
    var defaultNextV;
    if (wpReleasePreparer.isValidReleaseVersion(currentVersion)) {
      defaultNextV = wpReleasePreparer.getDefaultNextDevVersion(currentVersion);
    } else {
      defaultNextV = wpReleasePreparer.getDefaultNextDevVersion(
        wpReleasePreparer.getDefaultReleaseVersion(currentVersion)
      );
    }

    var options = {
      questions: [
        {
          name: 'nextVersion',
          type: 'input',
          message: 'Please type the next development version to be set to the webpackage:',
          validate: function (input) {
            if (!wpReleasePreparer.isValidDevVersion(input)) {
              throw new Error('Invalid nextVersion. (' + input + ') Please provide a valid development version ' +
                'e.g. \'1.0.0-SNAPSHOT\' or \'2.0-SNAPSHOT\'.');
            }
            return true;
          },
          default: defaultNextV
        }
      ]
    };

    var done = this.async();
    inquirer.prompt(options.questions).then(function (result) {
      // prepareRelease
      wpReleasePreparer.setNextDevVersion(result.nextVersion);
      wpReleasePreparer.updateManifestToNextDevVersion();
      done();
    });
  });
};
