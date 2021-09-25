'use strict';
const _ = require('lodash');

const SystemNotifyController = {
  async getUserNotifys(ctx) {
    try {
      const payload = ctx.query;
      const userNotifyList = await ctx.service.systemNotify.find(payload, {
        query: {
          user_id: ctx.session.user.id,
        },
        include: [
          {
            as: 'notify',
            attributes: ['title', 'content', '_id', 'id'],
            model: 'Announce',
          },
        ],
      });

      ctx.helper.renderSuccess(ctx, {
        data: userNotifyList,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async delUserNotify(ctx) {
    try {
      const targetIds = ctx.query.ids;
      if (!checkCurrentId(targetIds)) {
        throw new Error(ctx.__('validate_error_params'));
      } else {
        const ids = targetIds.split(',');
        // 删除消息记录
        for (let i = 0; i < ids.length; i++) {
          const userNotifyId = ids[i];
          const userNotifyObj = await ctx.service.systemNotify.item({
            query: {
              id: userNotifyId,
              user_id: ctx.session.user.id,
            },
          });
          if (!_.isEmpty(userNotifyObj)) {
            // await ctx.service.announce.removes(userNotifyObj.notify);
          }
        }
      }

      await ctx.service.systemNotify.removes(targetIds);
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async setMessageHasRead(ctx, app) {
    try {
      const targetIds = ctx.query.ids;
      const queryObj = {};
      // 用户只能操作自己的消息
      const userInfo = ctx.session.user || {};
      if (_.isEmpty(userInfo)) {
        throw new Error(ctx.__(ctx.__('validate_error_params')));
      } else {
        queryObj.user_id = ctx.session.user.id;
      }

      if (targetIds === 'all') {
        queryObj.isRead = true;
      } else {
        queryObj.id = {
          [app.Sequelize.Op.in]: targetIds,
        };
      }

      await ctx.service.systemNotify.updateMany(
        targetIds,
        {
          isRead: true,
        },
        queryObj
      );

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },
};

module.exports = SystemNotifyController;
