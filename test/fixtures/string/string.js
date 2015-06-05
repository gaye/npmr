'use strict';
var camelCase = require('camelcase');
var palindrome = require('palindrome');

exports.camelCaseIfPalindrome = function(word) {
  return palindrome(word) ? camelCase(word) : word;
};
