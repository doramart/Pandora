'use strict';

const contentTagRule = (ctx) => {
  return {
    name: {
      type: 'string',
      required: true,
      min: 1,
      max: 12,
      message: ctx.__('validate_error_field', [ctx.__('label_tag_name')]),
    },
    comments: {
      type: 'string',
      required: true,
      min: 2,
      max: 30,
      message: ctx.__('validate_inputCorrect', [ctx.__('label_comments')]),
    },
  };
};

const ContentTagController = {
  async list(ctx) {
    try {
      const payload = ctx.query;
      const contentTagList = await ctx.service.contentTag.find(payload, {
        searchKeys: ['name'],
      });

      ctx.helper.renderSuccess(ctx, {
        data: contentTagList,
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
        name: fields.name,
        alias: fields.alias,
        comments: fields.comments,
      };

      ctx.validate(contentTagRule(ctx), formObj);

      await ctx.service.contentTag.create(formObj);

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

      const targetItem = await ctx.service.contentTag.item({
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

  async update(ctx) {
    try {
      const fields = ctx.request.body || {};
      const formObj = {
        name: fields.name,
        alias: fields.alias,
        comments: fields.comments,
      };

      ctx.validate(contentTagRule(ctx), formObj);

      await ctx.service.contentTag.update(fields.id, formObj);

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async removes(ctx) {
    try {
      const targetIds = ctx.query.ids;
      await ctx.service.contentTag.removes(targetIds);
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },
};

module.exports = ContentTagController;
