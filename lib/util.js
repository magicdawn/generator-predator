'use strict';
const dirname = require('path').dirname;


/**
 * 获取 predator-kit/test/fixtures/ 路径
 */
exports.getTemplateRoot = function() {
  const fakeFile = require.resolve('predator-kit/test/fixtures/'); // <some_dir>/lib/index.js
  const templateRoot = dirname(fakeFile);
  return templateRoot;
};