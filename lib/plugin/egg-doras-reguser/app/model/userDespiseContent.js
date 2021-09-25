/*
 * @Author: doramart
 * @Date: 2020-08-16 15:32:43
 * @Last Modified by: doramart
 * @Description: 用户和文档的行为表 踩
 * @Last Modified time: 2021-03-26 17:35:19
 */
'use strict';

module.exports = (app) => {
  const { INTEGER } = app.Sequelize;
  const UserDespiseContent = app.model.define(
    'user_despise_content',
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
      tableName: 'doracms_user_despise_content',
      underscored: true,
      indexs: [
        {
          fields: ['content_id', 'user_id'],
          unique: true,
        },
      ],
    }
  );

  UserDespiseContent.associate = function () {};

  UserDespiseContent.sync({
    force: false,
  });

  return UserDespiseContent;
};
