'use strict';

/**
 * module dependencies
 */
const Base = require('yeoman-generator').Base;
const inherits = require('util').inherits;
const fs = require('needle-kit').fs;
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

  // 1. dependencies & devDependencies
  // 2. scripts.postinstall
  const tmp = _.pick(srcPackageJson, ['dependencies', 'devDependencies', 'scripts.postinstall']);
  destPackageJson = _.merge(destPackageJson, tmp);

  debug('template package.json : %j', srcPackageJson);
  debug('dest package.json : %j', destPackageJson);

  // writeJSON
  this.fs.writeJSON(destPackageJsonFile, destPackageJson, null, '  ');
  this.log('> processed: package.json');
  return true;
};

// gulpfile
// app.js index.js
// app & lib dir
Generator.prototype._copyFiles = function() {
  ['Gulpfile.js', 'app.js', 'index.js', '.eslintrc.yml'].forEach(f => {
    const src = this.templatePath(f);
    const dest = this.destinationPath(f);
    this.fs.copy(src, dest);
    this.log('> processed: ' + f);
  });

  // lib 文件夹
  fs.ensureDirSync(this.destinationPath('lib'));

  // app 文件夹
  const src = this.templatePath('app');
  const dest = this.destinationPath('app');
  this.fs.copy(src, dest);
  this.log('> processed: app/ dir');
};