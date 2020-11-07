'use strict'
const moment = require('moment');

module.exports = app => {
    const {
        DATE,
        STRING,
        INTEGER,
        TEXT
    } = app.Sequelize;
    const AdminGroup = app.model.define('admin_group', {
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
        power: {
            type: TEXT('long')
        },
        comments: STRING(100),
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
        tableName: 'doracms_admin_group',
        underscored: true,
    });

    AdminGroup.sync({
        force: false
    });

    return AdminGroup;
};