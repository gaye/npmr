/**
 * @fileoverview Wrapper around unix find.
 */
'use strict';
var co = require('co');
var exec = require('mz/child_process').exec;

module.exports = co.wrap(function *(dirname) {
  var results = yield exec(`find . ! -path "*node_modules*"`, {
    cwd: dirname
  });

  if (!results || !results.length) {
    return [];
  }

  var files = results[0].split(/\n/);
  return files.filter(function(filename) {
    return typeof !/^\s*$/.test(filename);
  });
});
