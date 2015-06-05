var reverse = require('reverse');

module.exports = function palindrome(string) {
  return string === reverse(string);
};
