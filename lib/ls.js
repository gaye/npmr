/**
 * @fileoverview Like `npm ls` except only prints local modules.
 */
'use strict';
var archy = require('archy');
var detectDependencyGraph = require('./util/detect_dependency_graph');
var manifest = require(`${process.cwd()}/package.json`);
var toArchyFormat = require('./util/to_archy_format');

module.exports = function ls() {
  var graph = detectDependencyGraph(process.cwd());
  var output = archy(toArchyFormat(manifest.name, graph));
  console.log(output);
};
