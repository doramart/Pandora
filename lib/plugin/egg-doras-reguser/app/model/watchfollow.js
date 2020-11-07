/*
 * @Author: doramart 
 * @Date: 2020-08-16 15:32:43 
 * @Last Modified by: doramart
 * @Description: 用户和文档的行为表 点赞，收藏，评论，踩 等
 * @Last Modified time: 2020-08-20 23:20:56
 */
const moment = require('moment');
module.exports = app => {
  const {
    INTEGER
  } = app.Sequelize;
  const WatchFollow = app.model.define('watch_follow', {

    watcher: { // 关注
      type: INTEGER,
      primaryKey: true
    },
    follower: { // 被关注
      type: INTEGER,
      primaryKey: true
    },

  }, {
    freezeTableName: true,
    tableName: 'doracms_watch_follow',
    indexs: [{
      fields: ['content_id', 'user_id'],
      unique: true,
    }],
  });

  WatchFollow.associate = function () {


  }

  WatchFollow.sync({
    force: false
  });

  return WatchFollow;
};