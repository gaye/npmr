'use strict';
var ArgumentParser = require('argparse').ArgumentParser;
var commands = require('./index');
var manifest = require('../package.json');

module.exports = function main() {
  var parser = new ArgumentParser({
    addHelp: true,
    description: manifest.description,
    version: manifest.version
  });

  parser.addArgument(['--production'], {
    defaultValue: false,
    help: 'whether or not to ignore devDependencies'
  });

  parser.addArgument(['--registry'], {
    defaultValue: 'https://registry.npmjs.com',
    help: 'npm registry',
    type: 'string',
  });

  var subparsers = parser.addSubparsers({
    dest: 'command',
    name: 'commands'
  });

  subparsers.addParser('install', {
    addHelp: true,
    description: 'execute any targets that are out of date'
  });

  subparsers.addParser('ls', {
    addHelp: true,
    description: 'prints the dependency graph of local modules in this tree'
  });

  subparsers.addParser('publish', {
    addHelp: true,
    description: 'publish the local module rooted in this directory'
  });

  var args = parser.parseArgs();
  return commands[args.command](args);
}
