'use strict';

/**
 * module dependencies
 */

const Base = require('yeoman-generator').Base;
const inherits = require('util').inherits;
const path = require('path');
const fs = require('needle-kit').fs;
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

  this.argument('name', {
    type: 'string',
    required: true
  });

  this.sourceRoot(getTemplateRoot());
}

inherits(Generator, Base);


/**
 * welcome
 */
Generator.prototype.default = function() {
  this._copyPage();
};

Generator.prototype._copyPage = function() {
  const page = this.name;
  const dir = this.destinationPath('app/' + page);

  // `app/<page>/` dir
  fs.ensureDir(dir);

  // copy
  //  - dir: assets fonts img css js view
  //  - file: index.js
  ['assets', 'fonts', 'img', 'css', 'js', 'view'].forEach(d => {
    // copy things
    const src = this.templatePath('app/index/' + d);
    const dest = dir + '/' + d;

    if (fs.existsSync(src)) {
      this.fs.copy(src, dest);
      this.log('> dir copied: %s/', `app/${ page }/${ d }`);
    } else {
      // make the dir
      fs.ensureDirSync(dest);
      this.log('> dir created: %s/', `app/${ page }/${ d }`);
    }
  });

  const src = this.templatePath('app/index/index.js'); // router
  const dest = dir + '/' + 'index.js';
  this.fs.copy(src, dest);
  this.log('> processed: index.js');
};