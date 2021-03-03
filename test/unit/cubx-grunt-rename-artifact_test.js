/**
 * Created by Edwin Gamboa on 16/05/2017.
 */
/* globals describe,beforeEach,it,afterEach, before, expect */
(function () {
  // function (manifestConverter, manifest831, convertedManifest910) {
  'use strict';
  let grunt;
  let fs;
  let path;
  let stdin;
  let wpBackupPath;
  let wpPath;
  let expectedManifestPath;
  let wpManifestPath;
  let invalidArtifactId;
  let firstOption;
  let validArtifactId;
  describe('cubx-grunt-rename-artifact-id', function () {
    before(function () {
      fs = require('fs-extra');
      path = require('path');

      invalidArtifactId = '?invalid';
      firstOption = 1;
      validArtifactId = 'app-renamed';

      wpBackupPath = path.resolve(__dirname, '../resources/wp-backup');
      wpPath = path.join(__dirname, '../resources/wp');
      wpManifestPath = path.join(wpPath, 'manifest.webpackage');
      expectedManifestPath = path.join(wpPath, validArtifactId, 'refactored-files', 'manifest.webpackage');
      fs.copySync(wpBackupPath, wpPath);
    });
    beforeEach(function () {
      stdin = require('mock-stdin').stdin();
      path = require('path');
      fs = require('fs-extra');
      grunt = require('grunt');
      grunt.task.init = function () {};
      const taskPath = path.resolve(process.cwd(), 'tasks');
      grunt.task.loadTasks(taskPath);

      fs.emptyDirSync(wpPath);
      fs.copySync(wpBackupPath, wpPath);
    });
    describe('run grunt task "_webpackage-renameArtifact", webpackage path configured in webpackagepath', function () {
      beforeEach(function () {
        // Init config
        grunt.initConfig({
          webpackagepath: wpPath
        });
      });
      afterEach(function () {
        grunt.initConfig({});
      });
      it('should rename an artifact', function (done) {
        process.nextTick(function () { stdin.send(firstOption + '\n'); });
        setTimeout(function () { stdin.send(validArtifactId + '\n'); }, 600);
        grunt.tasks(['_webpackage-renameArtifact'], {}, function () {
          const refactoredManifest = JSON.parse(fs.readFileSync(wpManifestPath, 'utf8'));
          const expectedManifest = JSON.parse(fs.readFileSync(expectedManifestPath, 'utf8'));
          expect(refactoredManifest).to.be.deep.equal(expectedManifest);
          done();
        });
      });
    });
    describe('run grunt task "_webpackage-renameArtifact", webpackage path configured in param.src', function () {
      beforeEach(function () {
        // Init config
        grunt.initConfig({
          param: {
            src: wpPath
          }
        });
      });
      afterEach(function () {
        grunt.initConfig({});
      });
      it('should rename an artifact', function (done) {
        process.nextTick(function () { stdin.send(firstOption + '\n'); });
        setTimeout(function () { stdin.send(validArtifactId + '\n'); }, 600);
        grunt.tasks(['_webpackage-renameArtifact'], {}, function () {
          const refactoredManifest = JSON.parse(fs.readFileSync(wpManifestPath, 'utf8'));
          const expectedManifest = JSON.parse(fs.readFileSync(expectedManifestPath, 'utf8'));
          expect(refactoredManifest).to.be.deep.equal(expectedManifest);
          done();
        });
      });
      it('should throw error since provided newArtifactName is invalid', function (done) {
        process.nextTick(function () { stdin.send(firstOption + '\n'); });
        setTimeout(function () { stdin.send(invalidArtifactId + '\n'); }, 600);
        grunt.tasks(['_webpackage-renameArtifact'], {}, expect(function b () {
          done();
        }).to.throw(/Invalid artifactName/));
      });
    });
  });
})();
