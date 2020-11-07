/*
 * @Author: doramart 
 * @Date: 2020-08-16 15:32:43 
 * @Last Modified by: doramart
 * @Description: 用户和文档的行为表 收藏
 * @Last Modified time: 2020-10-03 01:25:32
 */
const moment = require('moment');
module.exports = app => {
  const {
    INTEGER
  } = app.Sequelize;
  const UserFavoriteContent = app.model.define('user_favorite_content', {
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
    tableName: 'doracms_user_favorite_content',
    underscored: true,
    indexs: [{
      fields: ['content_id', 'user_id'],
      unique: true,
    }],
  });

  UserFavoriteContent.associate = function () {

    

  }

  UserFavoriteContent.sync({
    force: false
  });

  return UserFavoriteContent;
};