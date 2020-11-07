'use strict'

const moment = require('moment');
module.exports = app => {
    const {
        DATE,
        STRING,
        BOOLEAN,
        INTEGER

    } = app.Sequelize;
    const CryptoJS = require("crypto-js");
    const SystemConfig = app.model.define('system_config', {
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
        siteName: {
            type: STRING(500),
            defaultValue: 'DoraCMS'
        },
        ogTitle: STRING(500),
        siteLogo: {
            type: STRING(1000),
            defaultValue: '/static/themes/dorawhite/images/logo.png'
        },
        siteDomain: {
            type: STRING(1000),
            defaultValue: 'https://www.html-js.cn'
        },
        siteDiscription: {
            type: STRING(1000),
            defaultValue: '前端开发'
        },
        siteKeywords: STRING(1000),
        siteAltKeywords: STRING(1000),
        siteEmailServer: STRING(1000),
        siteEmail: STRING(100),
        siteEmailPwd: {
            type: STRING(500),
            set(value) {
                this.setDataValue('siteEmailPwd', CryptoJS.AES.encrypt(value, app.config.encrypt_key).toString());
            }
        },
        registrationNo: STRING(100),
        databackForderPath: STRING(1000),
        showImgCode: {
            type: BOOLEAN,
            defaultValue: true
        },
        bakDatabyTime: {
            type: BOOLEAN,
            defaultValue: false
        },
        bakDataRate: {
            type: STRING(100),
            defaultValue: '1'
        },
        statisticalCode: STRING(100),
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
        tableName: 'doracms_system_config',
        underscored: true,
    });

    SystemConfig.sync({
        force: false
    });

    return SystemConfig;
};

