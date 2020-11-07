'use strict';
const path = require('path')

module.exports = appInfo => {

    return {
        // 插件路径
        admin_root_path: 'https://cdn.html-js.cn/cms/plugins/static/sadmin',
        // 数据库连接
        sqlPath: {
            bin: '',
            backup: '/home/DoraProjectDb/doracms-sql/'
        },
        sequelize: {
            dialect: 'mysql',
            host: '127.0.0.1',
            port: 26987,
            database: 'doracms', //mysql database dir
            username: "root",
            password: "123456",
            delegate: 'model'
        },
        // 静态目录
        static: {
            prefix: '/static',
            dir: [path.join(appInfo.baseDir, 'app/public'), path.join(appInfo.baseDir, 'backstage/dist'), '/home/doraData/uploadFiles/static'],
            maxAge: 31536000,
        },
        // 日志路径
        logger: {
            dir: '/home/doraData/logsdir/doracms-sql',
        },
        // 服务地址配置
        server_path: 'https://sql.html-js.cn',
        server_api: 'https://sql.html-js.cn/api',

    }
};