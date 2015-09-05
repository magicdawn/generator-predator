/**
 * module dependencies
 */
var Base = require('yeoman-generator').Base;
var inherits = require('util').inherits;
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');

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

  // 使用 ../app/templates 下面的source
  this.sourceRoot(path.resolve(__dirname, '../app/templates'));
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

  if (fs.existsSync(dir)) {
    this.log('! `app/%s/` dir exists', page);
    return false;
  }

  // `app/<page>/` dir
  fse.ensureDir(dir);

  // copy 
  //  - dir: assets fonts img css js view
  //  - file: index.js
  ['assets', 'fonts', 'img', 'css', 'js', 'view'].forEach(function(d) {
    var src = self.templatePath('app/index/' + d);
    var dest = dir + '/' + d;
    fse.copySync(src, dest);
    self.log('> processed: %s/', d);
  });

  var src = this.templatePath('app/index/index.js'); // router
  var dest = dir + '/' + 'index.js';
  fse.copySync(src, dest);
  this.log('> processed: index.js');
};