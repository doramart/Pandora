/**
 * Created by Administrator on 2015/4/15.
 * 留言管理
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
    const Message = app.model.define('message', {
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
        content_id: {
            type: INTEGER
        }, // 留言对应的内容ID
        contentTitle: STRING, // 留言对应的内容标题
        author_id: {
            type: INTEGER
        }, // 留言对应的内容ID
        adminAuthor_id: {
            type: INTEGER,
            allowNull: true,
            defaultValue: null
        }, // 管理员ID
        replyAuthor_id: {
            type: INTEGER,
            allowNull: true,
            defaultValue: null
        }, // 被回复者ID
        adminReplyAuthor_id: {
            type: INTEGER,
            allowNull: true,
            defaultValue: null
        }, // 被回复者ID
        state: {
            type: BOOLEAN,
            defaultValue: false
        }, // 是否被举报
        utype: {
            type: STRING,
            defaultValue: '0'
        }, // 评论者类型 0,普通用户，1,管理员
        relationMsgId: STRING, // 关联的留言Id
        content: {
            type: STRING,
            defaultValue: "输入评论内容..."
        }, // 留言内容
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
        tableName: 'doracms_message',
        underscored: true,
    });

    Message.associate = function () {

        app.model.Message.belongsTo(app.model.Content, {
            foreignKey: 'content_id',
            as: 'contentId'
        });

        app.model.Message.belongsTo(app.model.User, {
            foreignKey: 'author_id',
            as: 'author'
        });

        app.model.Message.belongsTo(app.model.User, {
            foreignKey: 'replyAuthor_id',
            as: 'replyAuthor'
        });

        app.model.Message.belongsTo(app.model.AdminUser, {
            foreignKey: 'adminAuthor_id',
            as: 'adminAuthor'
        });

        app.model.Message.belongsTo(app.model.AdminUser, {
            foreignKey: 'adminReplyAuthor_id',
            as: 'adminReplyAuthor'
        });

    }

    Message.sync({
        force: false
    });



    return Message;
};