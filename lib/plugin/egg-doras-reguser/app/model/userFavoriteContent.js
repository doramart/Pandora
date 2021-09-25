/*
 * @Author: doramart
 * @Date: 2020-08-16 15:32:43
 * @Last Modified by: doramart
 * @Description: 用户和文档的行为表 收藏
 * @Last Modified time: 2021-03-26 17:35:30
 */
'use strict';

module.exports = (app) => {
  const { INTEGER } = app.Sequelize;
  const UserFavoriteContent = app.model.define(
    'user_favorite_content',
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
      tableName: 'doracms_user_favorite_content',
      underscored: true,
      indexs: [
        {
          fields: ['content_id', 'user_id'],
          unique: true,
        },
      ],
    }
  );

  UserFavoriteContent.associate = function () {};

  UserFavoriteContent.sync({
    force: false,
  });

  return UserFavoriteContent;
};
