'use strict';
var co = require('co');
var exec = require('mz/child_process').exec;
var expect = require('chai').expect;
var path = require('path');

suite('ls', function() {
  var result;

  setup(co.wrap(function *() {
    var npmr = path.normalize(`${__dirname}/../bin/npmr`);
    result = yield exec(`${npmr} ls`, { cwd: `${__dirname}/fixtures/string` });
  }));

  test('should print dependency tree', function() {
    expect(result[0]).to.equal(`string
├── lib/camelcase
└─┬ lib/palindrome
  └── lib/reverse

`);
  });
});
