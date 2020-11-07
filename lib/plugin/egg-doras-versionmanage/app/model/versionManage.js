/**
 * Created by Administrator on 2017/4/15.
 * app 版本管理
 */

'use strict'
const moment = require('moment');
module.exports = app => {
    const {
        DATE,
        STRING,
        BOOLEAN,
        INTEGER,
        VIRTUAL
    } = app.Sequelize;
    const VersionManage = app.model.define('version_manage', {
        id: {
            type: INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        _id: {
            type: VIRTUAL,
            get() {
                return this.id;
            },
            set(value) {
                throw new Error('not set!');
            }
        },
        title: STRING(500),
        client: STRING(500), //客户端类型 0安卓 1IOS
        description: STRING(500),
        version: STRING(500),
        versionName: STRING(500),
        forcibly: {
            type: BOOLEAN,
            defaultValue: false
        },
        url: STRING(500),
        createdAt: {
            type: DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt: {
            type: DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        freezeTableName: true,
        tableName: 'doracms_version_manage',
        underscored: true,
    });

    VersionManage.sync({
        force: false
    });

    return VersionManage;
};