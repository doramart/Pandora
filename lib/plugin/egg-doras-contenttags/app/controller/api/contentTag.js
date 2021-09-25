'use strict';

const ContentTagController = {
  async list(ctx) {
    try {
      const payload = ctx.query;

      const queryObj = Object.assign(
        {
          isPaging: '0',
        },
        payload
      );

      const contentTagList = await ctx.service.contentTag.find(queryObj);

      ctx.helper.renderSuccess(ctx, {
        data: contentTagList,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async hot(ctx) {
    try {
      const payload = ctx.query;
      const result = await ctx.service.contentTag.getHot(payload);
      ctx.helper.renderSuccess(ctx, {
        data: result,
      });
    } catch (error) {
      ctx.helper.renderFail(ctx, {
        message: error,
      });
    }
  },
};

module.exports = ContentTagController;
