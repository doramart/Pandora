/**
 * Created by Administrator on 2015/4/15.
 * 广告管理,广告单元
 */
'use strict'

const moment = require('moment');
module.exports = app => {
    const {
        DATE,
        STRING,
        INTEGER,
        VIRTUAL
    } = app.Sequelize;
    const AdsItems = app.model.define('ads_items', {
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
        title: STRING,
        link: STRING(500), // 广告链接
        ads_id: INTEGER, // 父广告id
        appLink: STRING(500), // app广告链接
        appLinkType: STRING, // app跳转类别 0文章，
        width: INTEGER,
        height: {
            type: INTEGER,
            defaultValue: 1
        },
        target: {
            type: STRING,
            defaultValue: '_blank'
        },
        sImg: STRING(500), // 图片路径
        alt: STRING, // 广告alt标识
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
        tableName: 'doracms_ads_items',
        underscored: true,
    });

    AdsItems.sync({
        force: false
    });

    return AdsItems;
};
