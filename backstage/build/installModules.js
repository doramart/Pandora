'use strict';
const path = require('path');
const modulesPath = path.resolve(__dirname, '../');
const shell = require('shelljs');
const { scanforder } = require('./utils');

// 指定打包模块
const designatedModule = ['content', 'dashboard', 'contentTemp'];

let targetBuildModules = scanforder(modulesPath);
if (designatedModule.length > 0) {
  targetBuildModules = designatedModule;
}
targetBuildModules.forEach(function (name) {
  if (
    name !== '.git' &&
    name !== 'build' &&
    name !== 'publicMethods' &&
    name !== 'dist'
  ) {
    shell.cd(`${modulesPath}/${name}`);
    shell.exec('cnpm install @vue/eslint-config-prettier -D');
    // shell.exec('npm install --registry=https://registry.npm.taobao.org');
  }
});
