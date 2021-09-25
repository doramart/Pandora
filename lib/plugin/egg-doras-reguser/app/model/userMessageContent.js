/*
 * @Author: doramart
 * @Date: 2020-08-16 15:32:43
 * @Last Modified by: doramart
 * @Description: 用户和文档的行为表 留言
 * @Last Modified time: 2021-03-26 17:35:39
 */
'use strict';

module.exports = (app) => {
  const { INTEGER } = app.Sequelize;
  const UserMessageContent = app.model.define(
    'user_message_content',
    {
      content_id: {
        type: INTEGER,
        primaryKey: true,
      },
      user_id: {
        type: INTEGER,
        primaryKey: true,
      },
    },
    {
      freezeTableName: true,
      tableName: 'doracms_user_message_content',
      underscored: true,
      indexs: [
        {
          fields: ['content_id', 'user_id'],
          unique: true,
        },
      ],
    }
  );

  UserMessageContent.associate = function () {};

  UserMessageContent.sync({
    force: false,
  });

  return UserMessageContent;
};
