'use strict'
const moment = require('moment');

module.exports = app => {
    const {
        DATE,
        STRING,
        INTEGER
    } = app.Sequelize;
    const Hook = app.model.define('hook', {
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
        description: STRING(100),
        hook_type: {
            type: STRING(100),
            defaultValue: '1'
        },
        ext: STRING(100),
        status: STRING(100),
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
        tableName: 'doracms_hook',
        underscored: true,
    });

    Hook.sync({
        force: false
    });

    return Hook;
};

