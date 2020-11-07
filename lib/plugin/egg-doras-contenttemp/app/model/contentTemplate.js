/*
 * @Author: doramart 
 * @Date: 2020-08-16 11:25:50 
 * @Last Modified by: doramart
 * @Description: 系统模板对象
 * @Last Modified time: 2020-10-04 22:36:32
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
    const ContentTemplate = app.model.define('content_template', {
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
        name: STRING,
        alias: {
            type: STRING,
            defaultValue: 'defaultTemp'
        }, //别名 指向模板文件夹
        version: {
            type: STRING,
            get() {
                const rawValue = this.getDataValue('version');
                return rawValue ? rawValue.split(',') : [];
            }
        }, // 适用版本
        sImg: {
            type: STRING(500),
            defaultValue: '/stylesheets/backstage/img/screenshot.png'
        },
        author: {
            type: STRING,
            defaultValue: 'doramart'
        }, // 主题作者
        using: {
            type: BOOLEAN,
            defaultValue: false
        }, // 是否被启用
        comment: STRING, // 主题描述
        shopTempId: STRING, // 关联模板市场id
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
        tableName: 'doracms_content_template',
        underscored: true,
    });

    ContentTemplate.associate = function () {
        app.model.ContentTemplate.hasMany(app.model.TemplateItems, {
            foreignKey: 'temp_id',
            sourceKey: 'id',
            as: "items"
        });
    }

    ContentTemplate.sync({
        force: false
    });

    return ContentTemplate;
};