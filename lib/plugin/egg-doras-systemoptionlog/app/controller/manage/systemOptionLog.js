/*
 * @Author: doramart
 * @Date: 2019-09-23 14:44:21
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-26 16:41:23
 */
'use strict';
const SystemOptionLogController = {
  async list(ctx) {
    try {
      const payload = ctx.query;
      const systemOptionLogList = await ctx.service.systemOptionLog.find(
        payload
      );

      ctx.helper.renderSuccess(ctx, {
        data: systemOptionLogList,
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
      await ctx.service.systemOptionLog.removes(targetIds);
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async removeAll(ctx) {
    try {
      await ctx.service.systemOptionLog.removeAll();
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },
};

module.exports = SystemOptionLogController;
