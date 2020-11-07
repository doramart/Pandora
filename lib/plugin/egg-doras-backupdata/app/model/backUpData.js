'use strict'

const moment = require('moment');
module.exports = app => {
    const {
        DATE,
        STRING,
        INTEGER,
        VIRTUAL
    } = app.Sequelize;
    const BackUpData = app.model.define('backup_data', {
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
        fileName: STRING(100),
        path: STRING(500),
        logs: STRING(500),
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
        tableName: 'doracms_backupdata',
        underscored: true,
    });

    BackUpData.sync({
        force: false
    });

    return BackUpData;
};