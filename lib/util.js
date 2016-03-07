'use strict';

/**
 * module dependencies
 */

const dirname = require('path').dirname;


/**
 * 获取 predator-kit/test/fixtures/ 路径
 */

exports.getTemplateRoot = () => {
  const fakeFile = require.resolve('predator-kit/test/fixtures/'); // <some_dir>/lib/index.js
  const templateRoot = dirname(fakeFile);
  return templateRoot;
};