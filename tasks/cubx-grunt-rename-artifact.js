/* global  */
'use strict';
const inquirer = require('inquirer');
const ArtifactRenamer = require('cubx-rename-artifact');
const path = require('path');

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
      const artifacts = {};
      const artifactsTypes = ['apps', 'utilities', 'elementaryComponents', 'compoundComponents'];
      if (Object.prototype.hasOwnProperty.call(manifest, 'artifacts')) {
        const manifestArtifacts = manifest.artifacts;
        artifactsTypes.forEach(function (artifactsKey) {
          if (Object.prototype.hasOwnProperty.call(manifestArtifacts, artifactsKey)) {
            manifestArtifacts[artifactsKey].forEach(function (artifact) {
              artifact.artifactType = artifactsKey;
              artifacts[artifact.artifactId] = artifact;
            });
          }
        });
      }
      return artifacts;
    }

    let webpackagePath = grunt.config.get('param.src');

    if (!webpackagePath) {
      webpackagePath = grunt.config.get('webpackagepath');
    }
    if (!webpackagePath) {
      throw new Error('webpackagePath missed. Please defined the option webpackagePath.');
    }
    const artifactRenamer = new ArtifactRenamer(webpackagePath);
    const manifest = grunt.file.readJSON(path.join(webpackagePath, 'manifest.webpackage'));

    const artifacts = getAllArtifacts(manifest);
    const options = {
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
            const artifactType = artifacts[answers.artifactId].artifactType;
            return 'Provide the new artifact name (e.g. ' + getArtifactNameExamples(artifactType) + '):';
          },
          validate: function (input, answers) {
            const artifactType = artifacts[answers.artifactId].artifactType;
            const regExp = getRegExpForArtifactType(artifactType);
            if (!regExp.test(input)) {
              throw new Error('Invalid artifactName. (' + input + '). Please provide a valid value like ' + getArtifactNameExamples(artifactType));
            }
            return true;
          }
        }
      ]
    };

    const done = this.async();
    inquirer.prompt(options.questions).then(function (result) {
      // rename Artifact
      artifactRenamer.renameArtifact(result.artifactId, result.newArtifactId);
      done();
    });
  });
};
