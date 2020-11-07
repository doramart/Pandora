'use strict'

const moment = require('moment');
module.exports = app => {
    const {
        DATE,
        STRING,
        BOOLEAN,
        INTEGER,
        ENUM,
        VIRTUAL
    } = app.Sequelize;
    const Announce = app.model.define('announce', {
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
        title: STRING(500),
        content: STRING(500),
        announce_type: ENUM('1', '2', '3'), // 消息的类型，1: 公告 Announce，2: 提醒 Remind，3：信息 Message
        target_content: INTEGER, // 目标的ID
        targetType: STRING, // 目标的类型
        action: STRING, // 提醒信息的动作类型
        sender_id: INTEGER,
        admin_sender_id: INTEGER,
        system_sender_id: STRING,
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
        tableName: 'doracms_announce',
        underscored: true,
    });

    Announce.associate = function () {

        app.model.Announce.belongsTo(app.model.AdminUser, {
            foreignKey: 'admin_sender_id',
            as: 'adminSender'
        });

    }

    Announce.sync({
        force: false
    });

    return Announce;
};
