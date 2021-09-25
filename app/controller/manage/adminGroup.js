/*
 * @Author: doramart
 * @Date: 2019-06-20 18:55:40
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-26 22:48:50
 */

'use strict';
const Controller = require('egg').Controller;

const { adminGroupRule } = require('@validate');

const _ = require('lodash');

class AdminGroupController extends Controller {
  async list() {
    const { ctx } = this;
    try {
      const payload = ctx.query;
      const adminGroupList = await ctx.service.adminGroup.find(payload);

      ctx.helper.renderSuccess(ctx, {
        data: adminGroupList,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async create() {
    const { ctx } = this;
    try {
      const fields = ctx.request.body || {};

      const formObj = {
        name: fields.name,
        comments: fields.comments,
        power: 0,
      };

      ctx.validate(adminGroupRule.form(ctx), formObj);

      await ctx.service.adminGroup.create(formObj);

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async getOne() {
    const { ctx } = this;
    try {
      const id = ctx.query.id;

      const targetGroup = await ctx.service.adminGroup.item({
        query: {
          id,
        },
      });

      ctx.helper.renderSuccess(ctx, {
        data: targetGroup,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async update() {
    const { ctx } = this;
    try {
      const fields = ctx.request.body || {};
      let currentPower = fields.power;

      const formObj = {
        name: fields.name,
        comments: fields.comments,
      };

      if (!_.isEmpty(currentPower)) {
        if (typeof currentPower === 'object') {
          currentPower = fields.power.join(',');
        }
        formObj.power = currentPower;
      } else {
        formObj.power = '';
      }

      ctx.validate(adminGroupRule.form(ctx), formObj);

      await ctx.service.adminGroup.update(fields.id, formObj);

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async removes() {
    const { ctx } = this;
    try {
      const targetIds = ctx.query.ids;
      await ctx.service.adminGroup.removes(targetIds);
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }
}

module.exports = AdminGroupController;
