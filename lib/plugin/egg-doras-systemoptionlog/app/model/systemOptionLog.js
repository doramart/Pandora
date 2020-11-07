/**
 * Created by Administrator on 2015/9/28.
 * 系统操作日志
 */
'use strict'

const moment = require('moment');
module.exports = app => {
    const {
        DATE,
        STRING,
        TEXT,
        INTEGER,
        VIRTUAL
    } = app.Sequelize;
    const SystemOptionLog = app.model.define('system_option_log', {
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
        log_type: STRING(100), //login:登录 exception:异常
        logs: TEXT('long'),
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
        tableName: 'doracms_system_option_log',
        underscored: true,
    });

    SystemOptionLog.sync({
        force: false
    });

    return SystemOptionLog;
};