/*
 * @Author: doramart 
 * @Date: 2019-08-14 17:20:30 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-09-19 23:26:28
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
    const ContentCategory = app.model.define('content_category', {
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
        keywords: STRING,
        cate_type: {
            type: STRING,
            defaultValue: '1' // 类别类型默认1,2单页面
        },
        type: {
            type: VIRTUAL,
            get() {
                return this.cate_type;
            },
            set(value) {
                throw new Error('not set!');
            }
        },
        url: {
            type: VIRTUAL,
            get() {
                return `/t/${this.defaultUrl}`;
            },
            set(value) {
                throw new Error('not set!');
            }
        },
        sortId: {
            type: INTEGER,
            defaultValue: 1
        },
        parentId: {
            type: STRING,
            defaultValue: '0'
        },
        enable: { //是否公开 默认公开
            type: BOOLEAN,
            defaultValue: true
        },
        content_temp: INTEGER,
        defaultUrl: {
            type: STRING,
            defaultValue: '' // seo link
        },
        homePage: {
            type: STRING,
            defaultValue: 'ui' // 必须唯一
        },
        sortPath: {
            type: STRING,
            defaultValue: '0' //存储所有父节点结构
        },
        comments: STRING,
        sImg: STRING(500),
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
        tableName: 'doracms_content_category',
        underscored: true,
    });

    ContentCategory.associate = function () {

        app.model.ContentCategory.belongsTo(app.model.TemplateItems, {
            foreignKey: 'content_temp',
            as: 'contentTemp'
        });



    }

    ContentCategory.sync({
        force: false
    });

    return ContentCategory;
};
