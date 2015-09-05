/**
 * module dependencies
 */
var Base = require('yeoman-generator').Base;
var inherits = require('util').inherits;
var fs = require('fs');
var fse = require('fs-extra');
var _ = require('lodash');
var debug = require('debug')('yeoman:predator:app');

/**
 * exports
 */

module.exports = Generator;


/**
 * class def
 */

function Generator() {
  Base.apply(this, arguments);

  // this.argument('name', {
  //   type: 'string',
  //   required: true
  // });
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
  var packageJsonFile = this.destinationPath('package.json');
  if (!fs.existsSync(packageJsonFile)) {
    this.log(`
    \`package.json\` not found at \`${ packageJsonFile }\`

    run \`npm init\` first
    `);
    return false;
  }

  var packageJson = this.fs.readJSON(packageJsonFile);

  // scripts
  packageJson.scripts.postinstall = "cd node_modules; ln -sf ../app; ln -sf ../lib";

  // dependencies 合并
  var templateDependencies = require('./templates/package').dependencies;
  packageJson.dependencies = _.assign(packageJson.dependencies || {}, templateDependencies);
  debug('template dependencies : %j', templateDependencies);
  debug('final dependencies : %j', packageJson.dependencies);

  this.fs.writeJSON(packageJsonFile, packageJson, null, '  ');
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
    var src = self.templatePath(f)
    var dest = self.destinationPath(f);
    copy(src, dest);
    self.log('> processed: ' + f);
  });

  // lib 文件夹
  fse.ensureDirSync(this.destinationPath('lib'));

  // app 文件夹
  if (fs.existsSync(this.destinationPath('app'))) {
    this.log('! `app/` dir exists, try remove `app/` dir');
    return;
  } else {
    var src = this.templatePath('app');
    var dest = this.destinationPath('app');
    fse.copySync(src, dest);
    this.log('> processed: app/ dir');
  }
};