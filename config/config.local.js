'use strict';
const path = require('path');

module.exports = (appInfo) => {
  return {
    admin_root_path: 'http://localhost',
    // DEV_CONFIG_MODULES_BEGIN
    dev_modules: [
      // 'navbar',
      // 'dashboard',
      // 'adminGroup',
      // 'adminUser',
      // 'adminResource',
      // 'systemConfig',
      // 'backUpData',
      // 'systemOptionLog',
      // 'announce',
      // 'systemNotify',
      // 'ads',
      // 'contentTemp',
      // 'templateConfig',
      // 'versionManage',
      // 'content',
      // 'contentTags',
      // 'contentCategory',
      // 'contentMessage',
      // 'regUser',
      // 'helpCenter',
      // 'renderCms',
      // 'cmsTemplate',
      // 'plugin',
      // 'uploadFile',
      // 'mailTemplate',
      // 'mailDelivery',
      // 'valine',
      // 'hook',
    ],
    // DEV_CONFIG_MODULES_END
    sqlPath: {
      bin: '/usr/local/mysql/bin/',
      backup: path.join(appInfo.baseDir, 'databak/'),
    },
    // 配置mysql信息
    sequelize: {
      dialect: 'mariadb',
      host: '192.168.31.102', // 本地
      port: 3307, // 本地
      database: 'doracmstest', // mysql database dir
      username: 'root',
      password: '123456',
      delegate: 'model',
    },
    static: {
      prefix: '/static',
      dir: [
        path.join(appInfo.baseDir, 'app/public'),
        path.join(appInfo.baseDir, 'backstage/dist'),
      ],
      maxAge: 31536000,
    },
    logger: {
      dir: path.join(appInfo.baseDir, 'logs'),
    },
    server_path: 'http://127.0.0.1:10003',
  };
};
