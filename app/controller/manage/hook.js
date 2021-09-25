/*
 * @Author: doramart
 * @Date: 2019-06-20 18:55:40
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-21 22:17:11
 */
'use strict';
const Controller = require('egg').Controller;

class HookController extends Controller {
  async list(ctx) {
    try {
      const payload = ctx.query;
      const queryObj = {};

      const hooksList = await ctx.service.hook.find(payload, {
        query: queryObj,
      });

      ctx.helper.renderSuccess(ctx, {
        data: hooksList,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async create(ctx) {
    try {
      const fields = ctx.request.body || {};
      const formObj = {
        name: fields.name,

        description: fields.description,

        type: fields.type,

        ext: fields.ext,

        status: fields.status,

        createTime: new Date(),
      };

      await ctx.service.hook.create(formObj);

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async getOne(ctx) {
    try {
      const id = ctx.query.id;

      const targetItem = await ctx.service.hook.item({
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
  }

  async update(ctx) {
    try {
      const fields = ctx.request.body || {};
      const formObj = {
        name: fields.name,

        description: fields.description,

        type: fields.type,

        ext: fields.ext,

        status: fields.status,

        updateTime: new Date(),
      };

      await ctx.service.hook.update(fields.id, formObj);

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async removes(ctx) {
    try {
      const targetIds = ctx.query.ids;
      await ctx.service.hook.removes(targetIds);
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }
}

module.exports = HookController;
