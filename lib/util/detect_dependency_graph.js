'use strict';
var isLocalPath = require('./is_local_path');
var path = require('path');

module.exports = function detectDependencyGraph(dirname) {
  var manifest = require(path.resolve(dirname, 'package.json'));
  var results = {};

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

      var dependencyPath = path.normalize(`${dirname}/${version.substring(5)}`);
      results[path.relative(process.cwd(), dependencyPath)] = detectDependencyGraph(dependencyPath);
    }
  });

  return results;
};
