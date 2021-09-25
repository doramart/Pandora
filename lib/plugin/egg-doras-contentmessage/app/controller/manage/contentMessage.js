'use strict';
const xss = require('xss');
const _ = require('lodash');

const messageRule = (ctx) => {
  return {
    content: {
      type: 'string',
      required: true,
      min: 5,
      max: 200,
      message: ctx.__('validate_rangelength', [
        ctx.__('label_messages_content'),
        5,
        200,
      ]),
    },
  };
};

const ContentMessageController = {
  async list(ctx) {
    try {
      const payload = ctx.query;

      const messageList = await ctx.service.message.find(payload, {
        searchKeys: ['content'],
      });

      ctx.helper.renderSuccess(ctx, {
        data: messageList,
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
      if (_.isEmpty(ctx.session.user) && _.isEmpty(ctx.session.adminUserInfo)) {
        throw new Error(ctx.__('validate_error_params'));
      }

      const formObj = {
        content_id: fields.contentId,
        content: xss(fields.content),
        replyAuthor_id: fields.replyAuthor,
        adminReplyAuthor_id: fields.adminReplyAuthor,
        relationMsgId: fields.relationMsgId,
        utype: fields.utype || '0',
      };

      ctx.validate(messageRule(ctx), formObj);

      if (fields.utype === '1') {
        // 管理员
        formObj.adminAuthor_id = ctx.session.adminUserInfo.id;
      } else {
        formObj.author_id = ctx.session.user.id;
      }

      const targetMessage = await ctx.service.message.create(formObj);

      const returnMessage = await ctx.service.message.item({
        query: {
          id: targetMessage.id,
        },
      });

      ctx.helper.renderSuccess(ctx, {
        data: returnMessage,
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

      const targetItem = await ctx.service.message.item({
        query: {
          id,
        },
      });

      ctx.helper.renderSuccess(ctx, {
        data: targetItem,
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
      await ctx.service.message.removes(targetIds);
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },
};

module.exports = ContentMessageController;
