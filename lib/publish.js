/**
 * @fileoverview Like `npm publish` but replaces package dependencies specified
 *     by local paths with their version so that we can publish to npm.
 */
'use strict';
var co = require('co');
var denodeify = require('promise').denodeify;
var detectDependencyGraph = require('./util/detect_dependency_graph');
var isLocalPath = require('./util/is_local_path');
var manifest = require(`${process.cwd()}/package.json`);
var mkdir = denodeify(require('tmp').dir);
var path = require('path');
var ncp = denodeify(require('ncp').ncp);
var npm = require('npm');
var writeFile = require('mz/fs').writeFile;

module.exports = co.wrap(function *publish(args) {
  var graph = detectDependencyGraph(process.cwd());

  [
    'dependencies',
    'devDependencies'
  ].forEach(function(dependencyType) {
    var dependencies = manifest[dependencyType];
    if (!dependencies) {
      return;
    }

    for (var name in dependencies) {
      var version = dependencies[name];
      if (!isLocalPath(version)) {
        continue;
      }

      // Check which version of this local package is in the tree.
      var dependencyPath = path.normalize(`${process.cwd()}/${version.substring(5)}`);
      var dependencyManifest = require(`${dependencyPath}/package.json`);
      dependencies[name] = dependencyManifest.version;
    }
  });

  var dir = yield mkdir();
  yield ncp(process.cwd(), dir);
  yield writeFile(`${dir}/package.json`, JSON.stringify(manifest));

  var result;
  try {
    yield denodeify(npm.load)();
    npm.config.set('registry', args.registry);
    result = yield denodeify(npm.publish)(dir);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }

  console.log(result);
});
