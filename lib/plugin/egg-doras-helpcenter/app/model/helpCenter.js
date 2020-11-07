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
    const HelpCenter = app.model.define('help_center', {
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
        name: STRING(500), // 标题
        lang: {
            type: STRING(500),
            defaultValue: '1'
        }, // 语言 1简体中文 2 英文 3 繁体中文
        state: {
            type: BOOLEAN,
            defaultValue: false
        },
        help_type: {
            type: STRING(500),
            defaultValue: '0'
        }, // 0为普通 1为其它
        comments: STRING(500),
        admin_userid: INTEGER,

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
        tableName: 'doracms_help_center',
        underscored: true,
    });

    HelpCenter.associate = function () {

        app.model.HelpCenter.belongsTo(app.model.AdminUser, {
            foreignKey: 'admin_userid',
            as: 'user'
        });

    }

    HelpCenter.sync({
        force: false
    });

    return HelpCenter;
};