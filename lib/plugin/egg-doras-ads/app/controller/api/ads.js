/*
 * @Author: doramart
 * @Date: 2019-09-26 09:19:25
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-26 12:05:45
 */
'use strict';

const AdsController = {
  async getOne(ctx) {
    try {
      const name = ctx.query.name;

      if (!name) {
        throw new Error(ctx.__('validate_error_params'));
      }

      const targetItem = await ctx.service.ads.item({
        query: {
          name,
          state: true,
        },
        include: [
          {
            as: 'items',
            model: 'AdsItems',
          },
        ],
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
};

module.exports = AdsController;
