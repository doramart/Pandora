'use strict'
const moment = require('moment');

module.exports = app => {
    const {
        DATE,
        STRING,
        TEXT,
        CHAR,
        BOOLEAN,
        INTEGER
    } = app.Sequelize;
    const CryptoJS = require("crypto-js");
    const AdminUser = app.model.define('admin_user', {
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
        userName: STRING(100),
        password: {
            type: STRING(100),
            set(value) {
                this.setDataValue('password', CryptoJS.AES.encrypt(value, app.config.encrypt_key).toString());
            }
        },
        email: STRING(100),
        countryCode: STRING(100),
        logo: {
            type: STRING,
            defaultValue: '/static/upload/images/defaultlogo.png'
        },
        enable: {
            type: BOOLEAN,
            defaultValue: false
        },
        state: {
            type: STRING(100),
            defaultValue: '1'
        },
        auth: {
            type: BOOLEAN,
            defaultValue: false
        },
        group_id: INTEGER,
        // editor_id: INTEGER,
        comments: TEXT('long'),
        phoneNum: CHAR(11),
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
        tableName: 'doracms_admin_user',
        underscored: true,
    });

    AdminUser.associate = function () {

        app.model.AdminUser.belongsTo(app.model.AdminGroup, {
            foreignKey: 'group_id',
            as: 'group'
        });

        // app.model.AdminUser.belongsTo(app.model.User, {
        //     foreignKey: 'editor_id',
        //     as: 'targetEditor'
        // });

    }

    AdminUser.sync({
        force: false
    });

    return AdminUser;
};
