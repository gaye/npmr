'use strict';
var expect = require('chai').expect;
var palindrome = require('../');

describe('palindrome', function() {
  it('should recognize a palindrome', function() {
    expect(palindrome('dog god')).to.be.true;
  });

  it('should recognize a non-palindrome', function() {
    expect(palindrome('frog god')).to.be.false;
  });
});
