/*
 * @Author: doramart
 * @Date: 2020-08-16 15:32:43
 * @Last Modified by: doramart
 * @Description: 文档和标签，分类，关键字等多对多关联表
 * @Last Modified time: 2021-03-26 12:41:07
 */
'use strict';

module.exports = (app) => {
  const { INTEGER } = app.Sequelize;
  const ContentAndTag = app.model.define(
    'content_and_tag',
    {
      content_id: {
        type: INTEGER,
        primaryKey: true,
      },
      tag_id: {
        type: INTEGER,
        primaryKey: true,
      },
    },
    {
      freezeTableName: true,
      tableName: 'doracms_content_and_tag',
      indexs: [
        {
          fields: ['content_id', 'tag_id'],
          unique: true,
        },
      ],
    }
  );

  ContentAndTag.associate = function () {};

  ContentAndTag.sync({
    force: false,
  });

  return ContentAndTag;
};
