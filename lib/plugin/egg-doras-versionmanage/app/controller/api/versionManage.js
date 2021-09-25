/*
 * @Author: doramart
 * @Date: 2019-09-23 14:44:21
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-26 13:50:10
 */

'use strict';

const VersionManageController = {
  async list(ctx) {
    try {
      const client = ctx.query.client;
      const queryObj = {};

      if (client) {
        if (client !== '0' && client !== '1') {
          throw new Error(ctx.__('validate_error_params'));
        } else {
          queryObj.client = client;
        }
      }

      const versionManageList = await ctx.service.versionManage.find(
        {
          isPaging: '0',
        },
        {
          query: queryObj,
        }
      );

      ctx.helper.renderSuccess(ctx, {
        data: versionManageList[0],
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

      const targetUser = await ctx.service.versionManage.item({
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
};

module.exports = VersionManageController;
