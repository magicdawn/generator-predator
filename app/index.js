'use strict';

/**
 * module dependencies
 */
const Base = require('yeoman-generator').Base;
const inherits = require('util').inherits;
const fs = require('fs-extra');
const _ = require('lodash');
const debug = require('debug')('yeoman:predator:app');
const path = require('path');
const symbols = require('log-symbols');
const getTemplateRoot = require('../lib/util').getTemplateRoot;

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
  this.sourceRoot(getTemplateRoot());
}
inherits(Generator, Base);

Generator.prototype.default = function() {

  // check package json
  const goon = this._packageJson();
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
  const destPackageJsonFile = this.destinationPath('package.json');
  const srcPackageJsonFile = this.templatePath('package.json');

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
  let destPackageJson = this.fs.readJSON(destPackageJsonFile);
  const srcPackageJson = this.fs.readJSON(srcPackageJsonFile);

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
  const self = this;
  const copy = this.fs.copy.bind(this.fs);

  ['Gulpfile.js', 'app.js', 'index.js', '.eslintrc'].forEach(function(f) {
    const src = self.templatePath(f);
    const dest = self.destinationPath(f);
    copy(src, dest);
    self.log('> processed: ' + f);
  });

  // lib 文件夹
  fs.ensureDirSync(this.destinationPath('lib'));

  // app 下文件夹
  [
    // global
    'global/assets',
    'global/fonts',
    'global/img',
    'global/css/main',
    'global/js/main',

    // index
    'index/assets',
    'index/fonts',
    'index/img',
    'index/css/main',
    'index/js/main'
  ].forEach(d => {
    d = this.destinationPath('app/' + d);
    fs.ensureDirSync(d);
  });

  // app 文件夹
  // 是完整用 fs-extra 拷贝的, 已存在, 则覆盖
  const src = this.templatePath('app');
  const dest = this.destinationPath('app');
  this.fs.copy(src, dest);
  this.log('> processed: app/ dir');
};