/*
 * @Author: doramart 
 * @Date: 2020-08-16 15:32:43 
 * @Last Modified by: doramart
 * @Description: 文档和标签，分类，关键字等多对多关联表
 * @Last Modified time: 2020-08-17 15:57:00
 */
const moment = require('moment');
module.exports = app => {
  const {
    INTEGER
  } = app.Sequelize;
  const ContentAndCategory = app.model.define('content_and_category', {

    content_id: {
      type: INTEGER,
      primaryKey: true
    },
    category_id: {
      type: INTEGER,
      primaryKey: true
    },

  }, {
    freezeTableName: true,
    tableName: 'doracms_content_and_category',
    indexs: [{
      fields: ['content_id', 'category_id'],
      unique: true,
    }],
  });

  ContentAndCategory.associate = function () {

  }

  ContentAndCategory.sync({
    force: false
  });

  return ContentAndCategory;
};