/*
 * @Author: doramart 
 * @Date: 2020-08-16 11:20:26 
 * @Last Modified by: doramart
 * @Description: 文章标签对象
 * @Last Modified time: 2020-09-19 23:26:39
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
    const ContentTag = app.model.define('content_tag', {
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
        url: {
            type: VIRTUAL,
            get() {
                return `/tag/${this.name}`;
            },
            set(value) {
                throw new Error('not set!');
            }
        },
        name: STRING,
        alias: STRING, //别名
        comments: STRING,
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
        tableName: 'doracms_content_tag',
        underscored: true,
    });

    ContentTag.sync({
        force: false
    });

    return ContentTag;
};