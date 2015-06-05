/**
 * @fileoverview Like `npm install` except will notice if changes have been
 *     made to local modules and update them.
 */
'use strict';
var assign = require('object-assign');
var co = require('co');
var denodeify = require('promise').denodeify;
var detectDependencyGraph = require('./util/detect_dependency_graph');
var exec = require('mz/child_process').exec;
var find = require('./util/find');
var manifest = require(`${process.cwd()}/package.json`);
var path = require('path');
var npm = require('npm');
var rimraf = denodeify(require('rimraf'));
var stat = require('mz/fs').stat;

module.exports = co.wrap(function *install(args) {
  npmInstall = npmInstall.bind(null, args);
  var graph = detectDependencyGraph(process.cwd());
  var latest;
  try {
    var filestat = yield stat(`${process.cwd()}/node_modules`);
    latest = filestat.ctime;
  } catch (error) {
    // if node_modules doesn't exist, we absolutely have to `npm install`.
    return yield npmInstall();
  }

  // Check for each local dependency whether it's been updated.
  yield Object.keys(graph).map(co.wrap(function *(dependency) {
    yield npmInstallIfDirty(latest, dependency, graph[dependency]);
  }));
});

var npmInstall = co.wrap(function *(args) {
  var result;
  try {
    yield denodeify(npm.load)();
    npm.config.set('production', args.production);
    result = yield denodeify(npm.install)();
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }

  process.stdout.write(result);
});

// This thing is a hot mess.
var npmInstallIfDirty = co.wrap(function *(latest, dependency, dependencies) {
  var folders = getAllKeys(dependencies);
  folders.push(dependency);

  // TODO(gaye): Can Array.prototype.some() be used with co?
  var dirty = false;
  for (var key in folders) {
    var folder = folders[key];
    var folderDirty = yield isFolderDirty(folder, latest);
    if (folderDirty) {
      dirty = true;
      break;
    }
  }

  if (!dirty) {
    return;
  }

  var dependencyName = getDependencyName(dependency);
  yield rimraf(`${process.cwd()}/node_modules/${dependencyName}`);
  var dependencyVersion = getDependencyVersion(dependencyName);
  yield npmInstall(dependencyVersion);
});

function getDependencyName(dependency) {
  var parts = dependency.split('/');
  dependency = parts[parts.length - 1];
  var dependencies = assign(
    {},
    manifest.dependencies || {},
    manifest.devDependencies || {}
  );

  for (var key in dependencies) {
    if (dependencies[key].endsWith(dependency)) {
      return key;
    }
  }
}

function getDependencyVersion(dependency) {
  var dependencies = assign(
    {},
    manifest.dependencies || {},
    manifest.devDependencies || {}
  );

  for (var key in dependencies) {
    if (key === dependency) {
      return dependencies[key];
    }
  }
}

/**
 * Checks whether a folder has is newer than another stats.
 */
var isFolderDirty = co.wrap(function *(folder, latest) {
  var files = yield find(folder);
  // co <> array/some ?
  for (var key in files) {
    var file = path.resolve(folder, files[key]);
    var filestat = yield stat(file);
    if (filestat.ctime > latest) {
      return true;
    }
  }

  return false;
});

function getAllKeys(object) {
  var result = [];
  var queue = [object];
  while (queue.length > 0) {
    var next = queue.shift();
    if (!Object.keys(next).length) {
      continue;
    }

    Object.keys(next).forEach(function(key) {
      result.push(key);
      queue.push(next[key]);
    });
  }

  return result;
}
