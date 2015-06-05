'use strict';
module.exports = function(string) {
  return reverse(string, '');
};

function reverse(original, reversed) {
  if (!original || !original.length) {
    return reversed;
  }

  return reverse(
    original.substring(0, original.length - 1),
    reversed + original.charAt(original.length - 1)
  );
}
