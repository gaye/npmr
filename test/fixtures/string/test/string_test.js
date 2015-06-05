var expect = require('chai').expect;
var string = require('../');

describe('string', function() {
  it('#camelCaseIfPalindrome when palindrome', function() {
    expect(
      string.camelCaseIfPalindrome('dam_mitim_mad')
    )
    .to.equal('damMitimMad');
  });

  it('#camelCaseIfPalindrome when not palindrome', function() {
    expect(
      string.camelCaseIfPalindrome('dam_mitim_rad')
    )
    .to.equal('dam_mitim_rad');
  });
});
