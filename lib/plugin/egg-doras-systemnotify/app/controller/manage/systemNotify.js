'use strict';
const _ = require('lodash');

const SystemNotifyController = {
  async list(ctx) {
    try {
      const payload = ctx.query;
      const userNotifyList = await ctx.service.systemNotify.find(payload, {
        query: {
          admin_userid: ctx.session.adminUserInfo.id,
        },
        include: [
          {
            as: 'notify',
            attributes: ['title', 'content', '_id', 'id'],
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

  async getOne(ctx) {
    try {
      const id = ctx.query.id;

      const targetUser = await ctx.service.systemNotify.item({
        query: {
          id,
        },
      });

      ctx.helper.renderSuccess(ctx, {
        data: targetUser,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async removes(ctx) {
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
            },
          });
          if (!_.isEmpty(userNotifyObj)) {
            await ctx.service.notify.removes(userNotifyObj.notify);
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

  async setMessageHasRead(ctx) {
    try {
      let targetIds = ctx.query.ids;

      if (!checkCurrentId(targetIds)) {
        throw new Error(ctx.__('validate_error_params'));
      } else {
        targetIds = targetIds.split(',');
      }

      await ctx.service.systemNotify.updateMany(
        targetIds,
        {
          isRead: true,
        },
        {
          query: {
            admin_userid: ctx.session.adminUserInfo.id,
          },
        }
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
