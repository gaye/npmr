'use strict';
var co = require('co');
var denodeify = require('promise').denodeify;
var exec = require('mz/child_process').exec;
var expect = require('chai').expect;
var path = require('path');
var rimraf = denodeify(require('rimraf'));
var writeFile = require('mz/fs').writeFile;

suite('install', function() {
  var result;

  setup(co.wrap(function *() {
    yield rimraf(`${__dirname}/fixtures/string/node_modules`);
    var npmr = path.normalize(`${__dirname}/../bin/npmr`);
    result = yield exec(`${npmr} --production 1 install`, {
      cwd: `${__dirname}/fixtures/string`
    });
  }));

  test('should install dependencies', function() {
    expect(result[0]).to.equal(`camelcase@0.0.1 node_modules/camelcase

palindrome@0.0.1 node_modules/palindrome
└── reverse@0.0.1
`);
  });

  test('calling install should noop if nothing changed', co.wrap(function *() {
    var npmr = path.normalize(`${__dirname}/../bin/npmr`);
    result = yield exec(`${npmr} --production 1 install`, {
      cwd: `${__dirname}/fixtures/string`
    });

    expect(result[0]).to.match(/^\s*$/);
  }));

  test('calling install should update dirty dependencies', co.wrap(function *() {
    yield writeFile(`${__dirname}/fixtures/string/lib/reverse/tmp`, 'foo');
    var npmr = path.normalize(`${__dirname}/../bin/npmr`);
    result = yield exec(`${npmr} --production 1 install`, {
      cwd: `${__dirname}/fixtures/string`
    });

    expect(result[0]).to.equal(`palindrome@0.0.1 node_modules/palindrome
└── reverse@0.0.1
`);
  }));
});
