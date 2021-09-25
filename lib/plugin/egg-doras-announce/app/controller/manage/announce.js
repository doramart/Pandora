'use strict';
const _ = require('lodash');

const announceRule = (ctx) => {
  return {
    title: {
      type: 'string',
      required: true,
      min: 5,
      max: 100,
      message: ctx.__('validate_error_field', [ctx.__('label_notify_title')]),
    },
    content: {
      type: 'string',
      required: true,
      min: 5,
      max: 500,
      message: ctx.__('validate_inputCorrect', [
        ctx.__('label_notify_content'),
      ]),
    },
  };
};

const AnnounceController = {
  async list(ctx) {
    try {
      const payload = ctx.query;

      const notifyList = await ctx.service.announce.find(payload, {
        query: {
          announce_type: '1',
        },
        include: [
          {
            as: 'adminSender',
            attributes: ['userName', 'id'],
            model: 'AdminUser',
          },
        ],
      });

      ctx.helper.renderSuccess(ctx, {
        data: notifyList,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async create(ctx) {
    try {
      const fields = ctx.request.body || {};
      const formObj = {
        title: fields.title,
        content: fields.content,
        admin_sender_id: ctx.session.adminUserInfo.id,
        announce_type: '1',
      };

      ctx.validate(announceRule(ctx), formObj);

      const announceObj = await ctx.service.announce.create(formObj);
      // 发送公告给用户
      const regUsers = await ctx.service.user.find(
        {
          isPaging: '0',
        },
        {
          query: {
            state: '1',
          },
        }
      );
      if (regUsers.length > 0 && !_.isEmpty(ctx.service.systemNotify)) {
        for (let i = 0; i < regUsers.length; i++) {
          await ctx.service.systemNotify.create({
            user_id: regUsers[i].id,
            notify_id: announceObj.id,
          });
        }
      }

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async getOne(ctx) {
    try {
      const id = ctx.query.id;

      const targetUser = await ctx.service.announce.item({
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

      if (!_.isEmpty(ctx.service.systemNotify)) {
        await ctx.service.systemNotify.removes(targetIds, 'notify_id');
      }

      await ctx.service.announce.removes(targetIds);

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },
};

module.exports = AnnounceController;
