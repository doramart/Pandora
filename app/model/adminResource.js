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
    const AdminResource = app.model.define('admin_resource', {
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
        label: STRING(100),
        source_type: STRING(100),
        routePath: STRING(100),
        icon: STRING(100),
        componentPath: STRING(100),
        api: STRING(100),
        parentId: STRING(100),
        isExt: {
            type: BOOLEAN,
            defaultValue: false
        },
        enable: {
            type: BOOLEAN,
            defaultValue: true
        },
        comments: TEXT('long'),
        sortId: {
            type: CHAR(11),
            defaultValue: '0'
        },
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
        tableName: 'doracms_admin_resource',
        underscored: true,
    });

    AdminResource.sync({
        force: false
    });

    return AdminResource;
};
