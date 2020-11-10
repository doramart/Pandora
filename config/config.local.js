'use strict';
const path = require('path')
const isDocker = process.env.BUILD_ENV == 'docker' ? true : false;

module.exports = appInfo => {

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
            backup: path.join(appInfo.baseDir, 'databak/')
        },
        //配置mysql信息
        sequelize: {
            dialect: 'mysql',
            host: '127.0.0.1', // 本地
            port: 3306,
            database: 'doracms', //mysql database dir
            username: "root",
            password: "doramart520",
            delegate: 'model'
        },
        static: {
            prefix: '/static',
            dir: [path.join(appInfo.baseDir, 'app/public'), path.join(appInfo.baseDir, 'backstage/dist')],
            maxAge: 31536000,
        },
        logger: {
            dir: path.join(appInfo.baseDir, 'logs'),
        },
        server_path: 'http://127.0.0.1:10003',
        server_api: 'http://127.0.0.1:10003/api',
        // 
    }
};