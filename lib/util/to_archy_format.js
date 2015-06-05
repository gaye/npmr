'use strict';
module.exports = function toArchyFormat(id, dependencies) {
  var result = {};
  result.label = id;
  result.nodes = [];

  for (var key in dependencies) {
    var value = dependencies[key];
    if (typeof value !== 'object') {
      result.nodes.push(value);
    } else {
      result.nodes.push(toArchyFormat(key, value));
    }
  }

  return result;
};
