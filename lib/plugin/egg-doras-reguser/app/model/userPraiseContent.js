/*
 * @Author: doramart 
 * @Date: 2020-08-16 15:32:43 
 * @Last Modified by: doramart
 * @Description: 用户和文档的行为表 点赞
 * @Last Modified time: 2020-10-03 00:37:28
 */
const moment = require('moment');
module.exports = app => {
  const {
    INTEGER
  } = app.Sequelize;
  const UserPraiseContent = app.model.define('user_praise_content', {
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
    tableName: 'doracms_user_praise_content',
    underscored: true,
    indexs: [{
      fields: ['content_id', 'user_id'],
      unique: true,
    }],
  });

  UserPraiseContent.associate = function () {


  }

  UserPraiseContent.sync({
    force: false
  });

  return UserPraiseContent;
};