'use strict';

/**
 * module dependencies
 */
var Base = require('yeoman-generator').Base;
var inherits = require('util').inherits;
var path = require('path');
var fs = require('fs-extra');

/**
 * exports
 */

module.exports = Generator;


/**
 * class def
 */

function Generator() {
  Base.apply(this, arguments);

  this.argument('name', {
    type: 'string',
    required: true
  });

  // use predator-kit 's test/fixtures as template
  var fixturesRoot = path.join(path.dirname(require.resolve('predator-kit')), 'test/fixtures');
  this.sourceRoot(fixturesRoot);
}
inherits(Generator, Base);


/**
 * welcome
 */
Generator.prototype.default = function() {
  this._copyPage();
};

Generator.prototype._copyPage = function() {
  var self = this;
  var page = this.name;
  var dir = this.destinationPath('app/' + page);

  // `app/<page>/` dir
  fs.ensureDir(dir);

  // copy
  //  - dir: assets fonts img css js view
  //  - file: index.js
  ['assets', 'fonts', 'img', 'css', 'js', 'view'].forEach(function(d) {

    // copy things
    var src = self.templatePath('app/index/' + d);
    var dest = dir + '/' + d;

    if (fs.existsSync(src)) {
      self.fs.copy(src, dest);
      self.log('> dir copied: %s/', `app/${ page }/${ d }`);
    } else {
      // make the dir
      fs.ensureDirSync(dest);
      self.log('> dir created: %s/', `app/${ page }/${ d }`);
    }
  });

  var src = this.templatePath('app/index/index.js'); // router
  var dest = dir + '/' + 'index.js';
  this.fs.copy(src, dest);
  this.log('> processed: index.js');
};