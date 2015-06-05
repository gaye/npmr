module.exports = function(string) {
  var parts = string.split('_');
  var result = parts[0];
  if (parts.length < 2) {
    return result;
  }

  parts.slice(1).forEach(function(part) {
    result += part.charAt(0).toUpperCase();
    result += part.substring(1);
  });

  return result;
};
