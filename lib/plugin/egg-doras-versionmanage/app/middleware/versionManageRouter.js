'use strict';
const versionManageManageController = require('../controller/manage/versionManage');
const versionManageApiController = require('../controller/api/versionManage');

module.exports = (options, app) => {
  return async function versionManageRouter(ctx, next) {
    const pluginConfig = app.config.doraVersionManage;
    await app.initPluginRouter(
      ctx,
      pluginConfig,
      versionManageManageController,
      versionManageApiController
    );
    await next();
  };
};
