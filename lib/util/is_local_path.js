'use strict';
module.exports = function isLocalPath(version) {
  return version.indexOf('file:') === 0;
};
