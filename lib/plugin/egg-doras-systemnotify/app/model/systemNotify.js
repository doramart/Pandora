/*
 * @Author: doramart
 * @Date: 2020-08-15 23:37:55
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-26 16:47:25
 */

'use strict';

const moment = require('moment');
module.exports = (app) => {
  const { DATE, BOOLEAN, INTEGER, VIRTUAL } = app.Sequelize;
  const SystemNotify = app.model.define(
    'system_notify',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      _id: {
        type: VIRTUAL,
        get() {
          return this.id;
        },
        set() {
          throw new Error('not set!');
        },
      },
      isRead: {
        type: BOOLEAN,
        defaultValue: false,
      },
      user_id: INTEGER,
      admin_userid: INTEGER,
      notify_id: INTEGER,
      createdAt: {
        type: DATE,
        get() {
          return moment(this.getDataValue('createdAt')).format(
            'YYYY-MM-DD HH:mm:ss'
          );
        },
      },
      updatedAt: {
        type: DATE,
        get() {
          return moment(this.getDataValue('updatedAt')).format(
            'YYYY-MM-DD HH:mm:ss'
          );
        },
      },
    },
    {
      freezeTableName: true,
      tableName: 'doracms_system_notify',
      underscored: true,
    }
  );

  SystemNotify.associate = function () {
    app.model.SystemNotify.belongsTo(app.model.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    app.model.SystemNotify.belongsTo(app.model.AdminUser, {
      foreignKey: 'admin_userid',
      as: 'systemUser',
    });

    app.model.SystemNotify.belongsTo(app.model.Announce, {
      foreignKey: 'notify_id',
      as: 'notify',
    });
  };

  SystemNotify.sync({
    force: false,
  });

  return SystemNotify;
};
