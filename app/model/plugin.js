'use strict'
/*
 * @Author: doramart 
 * @Date: 2019-09-23 13:28:28 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-10-23 23:32:25
 */

const moment = require('moment');

module.exports = app => {
    const {
        DATE,
        STRING,
        BOOLEAN,
        INTEGER
    } = app.Sequelize;
    const Plugin = app.model.define('plugin', {
        id: {
            type: INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        _id: {
            type: INTEGER,
            get() {
                return `${this.id}`;
            },
            set(value) {
                throw new Error('not set!');
            }
        },
        name: STRING(100),
        pluginId: STRING(100),
        alias: STRING(100),
        pkgName: STRING(100),
        enName: STRING(100),
        description: STRING(100),
        state: {
            type: BOOLEAN,
            defaultValue: false
        },
        amount: {
            type: INTEGER,
            defaultValue: 0
        },
        isadm: {
            type: STRING(100),
            defaultValue: '1'
        },
        isindex: {
            type: STRING(100),
            defaultValue: '0'
        },
        version: STRING(100),
        operationInstructions: STRING(100),
        author: STRING(100),
        adminUrl: STRING(100),
        iconName: STRING(100),
        adminApi: STRING(100),
        fontApi: STRING(100),
        authUser: {
            type: BOOLEAN,
            defaultValue: false
        },
        initDataPath: STRING(100),
        hooks: STRING(100),
        defaultConfig: STRING(100),
        pluginsConfig: STRING(100),
        plugin_type: {
            type: STRING(100),
            defaultValue: '1'
        },
        installor: STRING(100),
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
        tableName: 'doracms_plugin',
        underscored: true,
    });

    Plugin.sync({
        force: false
    });

    return Plugin;
};