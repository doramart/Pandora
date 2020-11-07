/*
 * @Author: doramart 
 * @Date: 2020-08-16 11:22:38 
 * @Last Modified by: doramart
 * @Description: 子模板信息
 * @Last Modified time: 2020-10-01 23:00:39
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
    const TemplateItems = app.model.define('template_items', {
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
        temp_id: INTEGER, // 父模板id
        forder: {
            type: STRING,
            defaultValue: '2-stage-default'
        }, //别名 指向模板文件夹
        cateName: {
            type: STRING,
            defaultValue: 'contentList'
        }, // 模板类型 大类列表
        detailName: {
            type: STRING,
            defaultValue: 'detail'
        }, // 模板类型 内容详情
        isDefault: {
            type: BOOLEAN,
            defaultValue: false
        }, // 是否为默认模板
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
        tableName: 'doracms_template_items',
        underscored: true,
    });

    TemplateItems.associate = function () {

        // app.model.TemplateItems.belongsTo(app.model.ContentTemplate, {
        //     foreignKey: 'temp_id',
        //     as: 'temp'
        // });

    }

    TemplateItems.sync({
        force: false
    });

    return TemplateItems;
};