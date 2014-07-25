var path = require('path');
var format = require('util').format;
var semver = require('semver');
var parents = require('parents');
var log = require('npmlog');

function PeerDep() {
  if (!(this instanceof PeerDep)) return new PeerDep();
  this.cwd = process.cwd();
  this.pkg = require(path.join(this.cwd, 'package.json'));
  this.parents = parents(this.cwd);
}
module.exports = PeerDep;

PeerDep.prototype.cli = function(args) {
  var warnings = this.gatherDeps(args[0]);
  if (warnings.length > 0) {
    for (var i = 0; i < warnings.length; i++) {
      log.warn('peerinvalid', warnings[i]);
    }
  }
};

PeerDep.prototype.gatherDeps = function(key) {
  var self = this;
  key = key || 'peerDependencies';
  var warnings = [];
  var deps = this.pkg[key] || Object.create(null);
  var keys = Object.keys(deps);
  for (var i = 0; i < keys.length; i++) {
    var dep = keys[i];
    var version = deps[dep];
    var deppkg = this.findDepPkg(dep);
    if (!deppkg) {
      warnings.push(format(
        'Peer %s@%s wants %s@%s but did not find "%s" installed. Please install with "npm install %s@%s"',
        this.pkg.name, this.pkg.version,
        dep, version,
        dep, dep, version
      ));
      continue;
    }
    if (!semver.valid(deppkg.version)) {
      warnings.push(format('%s is an invalid version for %s', deppkg.version, dep));
      continue;
    }
    if (!semver.satisfies(deppkg.version, version)) {
      warnings.push(format(
        'Peer %s@%s wants %s@%s but found "%s@%s" installed.',
        this.pkg.name, this.pkg.version,
        dep, version,
        deppkg.name, deppkg.version
      ));
    }
  }
  return warnings;
};

PeerDep.prototype.findDepPkg = function(name) {
  var found = null;
  for (var p = 0; p < this.parents.length; p++) {
    var filepath = path.join(this.parents[p], 'node_modules', name);
    try {
      found = require(path.join(filepath, 'package.json'));
      break;
    } catch (err) {
      found = null;
    }
  }
  return found;
};
