'use strict';
module.exports = function(emitter, eventType) {
  return new Promise(function(resolve) {
    emitter.on(eventType, function onevent() {
      emitter.removeListener(eventType, onevent);
      resolve();
    });
  });
};
