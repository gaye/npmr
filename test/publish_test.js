'use strict';
var co = require('co');
var denodeify = require('promise').denodeify;
var exec = require('mz/child_process').exec;
var expect = require('chai').expect;
var fork = require('child_process').fork;
var path = require('path');
var tcpPortUsed = require('tcp-port-used');
var waitForEvent = require('./wait_for_event');

suite('publish', function() {
  var server;
  var stdout = '';
  var result;

  setup(co.wrap(function *() {
    server = fork(`${__dirname}/npm_fake_server.js`, { silent: true });
    server.stdout.on('data', function(buf) {
      stdout += buf.toString();
    });

    yield tcpPortUsed.check(8080);

    var npmr = path.normalize(`${__dirname}/../bin/npmr`);
    result = yield exec(`${npmr} --registry http://localhost:8080 publish`, {
      cwd: `${__dirname}/fixtures/string`
    });
  }));

  teardown(co.wrap(function *() {
    server.kill();
    yield waitForEvent(server, 'exit');
  }));

  test('should publish correct manifest', function() {
    expect(result[0]).to.include('+ string@0.0.1');
    expect(result[1]).to.match(/^\s*$/);
    var manifest = JSON.parse(stdout).versions['0.0.1'];
    expect(manifest.name).to.equal('string');
    expect(manifest.version).to.equal('0.0.1');
    expect(manifest.dependencies).to.deep.equal({
      camelcase: '0.0.1',
      palindrome: '0.0.1'
    });
  });
});
