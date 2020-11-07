/**
 * Created by Administrator on 2017/4/15.
 * 广告管理
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
    const Ads = app.model.define('ads', {
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
        ads_type: {
            type: STRING,
            defaultValue: '0' // 展示形式 0文字 1图片 2友情链接
        },
        type: {
            type: VIRTUAL,
            get() {
                return this.ads_type;
            },
            set(value) {
                throw new Error('not set!');
            }
        },
        carousel: {
            type: BOOLEAN,
            defaultValue: true
        }, // 针对图片是否轮播  
        state: {
            type: BOOLEAN,
            defaultValue: true
        }, // 广告状态，是否显示
        height: {
            type: INTEGER,
            defaultValue: 50
        },
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
        tableName: 'doracms_ads',
        underscored: true,
    });

    Ads.associate = function () {
        app.model.Ads.hasMany(app.model.AdsItems, {
            foreignKey: 'ads_id',
            sourceKey: 'id',
            as: "items"
        });
    }

    Ads.sync({
        force: false
    });

    return Ads;
};
