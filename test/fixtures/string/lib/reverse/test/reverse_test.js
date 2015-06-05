'use strict';
var expect = require('chai').expect;
var reverse = require('../');

describe('reverse', function() {
  it('should reverse a string', function() {
    expect(reverse('banana')).to.equal('ananab');
  });
});
