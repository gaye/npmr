'use strict';
var camelcase = require('../');
var expect = require('chai').expect;

describe('camelcase', function() {
  it('should not modify when no underscores', function() {
    expect(camelcase('hello')).to.equal('hello');
  });

  it('should camelcase when underscores', function() {
    expect(camelcase('talking_about_my_girl')).to.equal('talkingAboutMyGirl');
  });
});
