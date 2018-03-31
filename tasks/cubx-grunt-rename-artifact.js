/* global  */
'use strict';
var inquirer = require('inquirer');
var ArtifactRenamer = require('cubx-rename-artifact');
var path = require('path');
var wrap = require('wordwrap')(70);

module.exports = function (grunt) {
  grunt.registerTask('_webpackage-renameArtifact', 'Rename a certain artifact', function () {
    function getRegExpForArtifactType (artifactType) {
      if (artifactType === 'elementaryComponents' || artifactType === 'compoundComponents') {
        return /^[a-z0-9]+(-[a-z0-9]+)+$/;
      } else if (artifactType === 'apps' || artifactType === 'utilities') {
        return /^[a-z0-9-]+$/;
      }
    }

    function getArtifactNameExamples (artifactType) {
      switch (artifactType) {
        case 'elementaryComponents':
          return '\'my-elementary\' or \'my-demo-elementary\'!';
        case 'compoundComponents':
          return '\'my-compound\' or \'my-demo-compound\'!';
        case 'apps':
          return '\'demoapp\' or \'my-demo-app\'!';
        case 'utilities':
          return '\'util\' or \'my-demo-util\'!';
      }
    }

    function getAllArtifacts (manifest) {
      var artifacts = {};
      var artifactsArrays = ['apps', 'utilities', 'elementaryComponents', 'compoundComponents'];
      if (manifest.hasOwnProperty('artifacts')) {
        var manifestArtifacts = manifest.artifacts;
        artifactsArrays.forEach(function (artifactsKey) {
          if (manifestArtifacts.hasOwnProperty(artifactsKey)) {
            manifestArtifacts[artifactsKey].forEach(function (artifact) {
              artifact.type = artifactsKey;
              artifacts[artifactsKey] = artifact;
            });
          }
        });
      }
      return artifacts;
    }

    var webpackagePath = grunt.config.get('param.src');

    if (!webpackagePath) {
      webpackagePath = grunt.config.get('webpackagepath');
    }
    if (!webpackagePath) {
      throw new Error('webpackagePath missed. Please defined the option webpackagePath.');
    }
    var artifactRenamer = new ArtifactRenamer(webpackagePath);
    var manifest = grunt.file.readJSON(path.join(webpackagePath, 'manifest.webpackage'));

    var artifacts = getAllArtifacts(manifest);
    var options = {
      questions: [
        {
          name: 'artifactId',
          type: 'rawlist',
          message: 'Provide the artifactId of the artifact to be renamed.',
          choices: Object.keys(artifacts)
        },
        {
          name: 'newArtifactId',
          type: 'input',
          message: function (answers) {
            var artifactType = artifacts[answers.artifactId].artifactType;
            return 'Provide the new artifact name (e.g. ' + getArtifactNameExamples(artifactType) + '):';
          },
          validate: function (input, answers) {
            var artifactType = artifacts[answers.artifactId].artifactType;
            var regExp = getRegExpForArtifactType(artifactType);
            if (!regExp.test(input)) {
              return wrap(' Please provide a valid value like ' + getArtifactNameExamples(artifactType));
            }
            return true;
          }
        }
      ]
    };

    var done = this.async();
    inquirer.prompt(options.questions).then(function (result) {
      // prepareRelease
      artifactRenamer.renameArtifact(result.artifactId, result.newArtifactId);
      done();
    });
  });
};
