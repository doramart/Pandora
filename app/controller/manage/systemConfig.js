/*
 * @Author: doramart
 * @Date: 2019-06-20 18:55:40
 * @Last Modified by: doramart
 * @Last Modified time: 2021-04-05 18:57:32
 */
'use strict';
const Controller = require('egg').Controller;

const { systemConfigRule } = require('@validate');

const _ = require('lodash');

class SystemConfigController extends Controller {
  async list() {
    const { ctx } = this;
    try {
      const payload = ctx.query;
      const systemConfigList = await ctx.service.systemConfig.find(payload, {
        attributes: {
          exclude: ['siteEmailPwd'],
        },
      });
      ctx.helper.renderSuccess(ctx, {
        data: systemConfigList,
      });
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

      const targetUser = await ctx.service.systemConfig.item({
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
  }

  async update() {
    const { ctx } = this;
    try {
      const fields = ctx.request.body || {};
      const formObj = {
        siteName: fields.siteName,
        siteLogo: fields.siteLogo,
        ogTitle: fields.ogTitle,
        siteDomain: fields.siteDomain,
        siteDiscription: fields.siteDiscription,
        siteKeywords: fields.siteKeywords,
        siteAltKeywords: fields.siteAltKeywords,
        siteEmailServer: fields.siteEmailServer,
        siteEmail: fields.siteEmail,
        registrationNo: fields.registrationNo,
        databackForderPath: fields.databackForderPath,
        showImgCode: fields.showImgCode,
        statisticalCode: fields.statisticalCode,
        bakDatabyTime: fields.bakDatabyTime,
        bakDataRate: fields.bakDataRate,
        editorType: fields.editorType,
      };

      ctx.validate(systemConfigRule.form(ctx), formObj);

      // 单独判断密码
      if (fields.siteEmailPwd) {
        if (fields.siteEmailPwd.length < 6) {
          throw new Error(
            ctx.__('validate_inputCorrect', [ctx.__('label_password')])
          );
        } else {
          formObj.siteEmailPwd = fields.siteEmailPwd;
        }
      }

      if (fields.id) {
        await ctx.service.systemConfig.update(fields.id, formObj);
      } else {
        await ctx.service.systemConfig.create(formObj);
      }

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
      await ctx.service.systemConfig.removes(targetIds);
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  cancelBakDataTask() {
    if (!_.isEmpty(global.bakDataTask)) {
      global.bakDataTask.cancel();
    }
  }
}

module.exports = SystemConfigController;
