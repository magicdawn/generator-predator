'use strict';

/**
 * module dependencies
 */
var Base = require('yeoman-generator').Base;
var inherits = require('util').inherits;
var fs = require('fs-extra');
var _ = require('lodash');
var debug = require('debug')('yeoman:predator:app');
var path = require('path');
var symbols = require('log-symbols');

/**
 * exports
 */

module.exports = Generator;


/**
 * class def
 */

function Generator() {
  Base.apply(this, arguments);

  // use predator-kit 's test/fixtures as template
  var fixturesRoot = path.join(path.dirname(require.resolve('predator-kit')), 'test/fixtures');
  this.sourceRoot(fixturesRoot);
}
inherits(Generator, Base);

Generator.prototype.default = function() {

  // check package json
  var goon = this._packageJson();
  if (!goon) {
    return;
  }

  // gulpfile
  // app.js index.js
  // app & lib dir
  this._copyFiles();
};

/**
 * package.json related
 */
Generator.prototype._packageJson = function() {
  var destPackageJsonFile = this.destinationPath('package.json');
  var srcPackageJsonFile = this.templatePath('package.json');

  // the dest `package.json` not exists
  // abort
  if (!fs.existsSync(destPackageJsonFile)) {
    this.log(`
  ${ symbols.error } "package.json" not found at "${ destPackageJsonFile }"

  ${ symbols.info } try \`npm init\` first
    `);
    return false;
  }

  // handle package.json
  var destPackageJson = this.fs.readJSON(destPackageJsonFile);
  var srcPackageJson = this.fs.readJSON(srcPackageJsonFile);

  // 1.scripts
  destPackageJson = destPackageJson || {};
  destPackageJson.scripts = destPackageJson.scripts || {};
  destPackageJson.scripts.postinstall = srcPackageJson.scripts.postinstall;

  // 2.dependencies
  destPackageJson.dependencies = _.assign(destPackageJson.dependencies || {}, srcPackageJson.dependencies);
  debug('template dependencies : %j', srcPackageJson.dependencies);
  debug('final dependencies : %j', destPackageJson.dependencies);

  // writeJSON
  this.fs.writeJSON(destPackageJsonFile, destPackageJson, null, '  ');
  this.log('> processed: package.json');
  return true;
};

// gulpfile
// app.js index.js
// app & lib dir
Generator.prototype._copyFiles = function() {
  var self = this;
  var copy = this.fs.copy.bind(this.fs);

  ['Gulpfile.js', 'app.js', 'index.js'].forEach(function(f) {
    var src = self.templatePath(f);
    var dest = self.destinationPath(f);
    copy(src, dest);
    self.log('> processed: ' + f);
  });

  // lib 文件夹
  fs.ensureDirSync(this.destinationPath('lib'));

  // app 文件夹
  // 是完整用 fs-extra 拷贝的, 已存在, 则覆盖
  var src = this.templatePath('app');
  var dest = this.destinationPath('app');
  this.fs.copy(src, dest);
  this.log('> processed: app/ dir');
};