/*
 * @Author: doramart 
 * @Date: 2020-08-16 15:32:43 
 * @Last Modified by: doramart
 * @Description: 用户和文档的行为表 留言
 * @Last Modified time: 2020-10-04 21:57:31
 */
const moment = require('moment');
module.exports = app => {
  const {
    INTEGER
  } = app.Sequelize;
  const UserMessageContent = app.model.define('user_message_content', {
    content_id: {
      type: INTEGER,
      primaryKey: true
    },
    user_id: {
      type: INTEGER,
      primaryKey: true
    }
  }, {
    freezeTableName: true,
    tableName: 'doracms_user_message_content',
    underscored: true,
    indexs: [{
      fields: ['content_id', 'user_id'],
      unique: true,
    }],
  });

  UserMessageContent.associate = function () {


  }

  UserMessageContent.sync({
    force: false
  });

  return UserMessageContent;
};