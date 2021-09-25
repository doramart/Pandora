'use strict';
const _ = require('lodash');

const adsRule = (ctx) => {
  return {
    name: {
      type: 'string',
      required: true,
      min: 2,
      max: 15,
      message: ctx.__('validate_error_field', [ctx.__('label_ads_name')]),
    },
    comments: {
      type: 'string',
      required: true,
      min: 5,
      max: 30,
      message: ctx.__('validate_inputCorrect', [ctx.__('label_comments')]),
    },
  };
};

const AdsController = {
  async list(ctx) {
    try {
      const payload = ctx.query;
      const adsList = await ctx.service.ads.find(payload, {
        include: [
          {
            as: 'items',
            model: 'AdsItems',
          },
        ],
      });

      ctx.helper.renderSuccess(ctx, {
        data: adsList,
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
        state: fields.state,
        height: fields.height || null,
        carousel: fields.carousel,
        ads_type: fields.ads_type,
        comments: fields.comments,
      };

      ctx.validate(adsRule(ctx), formObj);

      const newAds = await ctx.service.ads.create(formObj);
      const adsItems = fields.items;
      if (adsItems.length > 0) {
        for (let i = 0; i < adsItems.length; i++) {
          if (!adsItems[i].width) {
            adsItems[i].width = null;
          }
          if (!adsItems[i].height) {
            adsItems[i].height = null;
          }
          adsItems[i].ads_id = newAds.id;
          await ctx.service.adsItem.create(adsItems[i]);
          // itemIdArr.push(newItem.id);
        }
      }
      // formObj.items = itemIdArr;

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

      const targetItem = await ctx.service.ads.item({
        query: {
          id,
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

  async update(ctx) {
    try {
      const fields = ctx.request.body || {};
      const formObj = {
        name: fields.name,
        state: fields.state,
        height: fields.height || null,
        carousel: fields.carousel,
        ads_type: fields.ads_type,
        comments: fields.comments,
      };

      ctx.validate(adsRule(ctx), formObj);

      const adsItems = fields.items;
      if (adsItems.length > 0) {
        for (let i = 0; i < adsItems.length; i++) {
          const targetItem = adsItems[i];
          if (!adsItems[i].width) {
            adsItems[i].width = null;
          }
          if (!adsItems[i].height) {
            adsItems[i].height = null;
          }
          if (targetItem.id) {
            delete targetItem._id;
            await ctx.service.adsItem.update(targetItem.id, targetItem);
          } else {
            targetItem.ads_id = fields.id;
            await ctx.service.adsItem.create(targetItem);
          }
        }
      }
      await ctx.service.ads.update(fields.id, formObj);

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

      if (!checkCurrentId(targetIds)) {
        throw new Error(ctx.__('validate_error_params'));
      } else {
        const ids = targetIds.split(',');

        for (let i = 0; i < ids.length; i++) {
          const currentId = ids[i];

          const targetAd = await ctx.service.ads.item({
            query: {
              id: currentId,
            },
          });
          if (!_.isEmpty(targetAd)) {
            await ctx.service.adsItem.removes(targetAd.id, 'ads_id');
          }
        }
      }

      await ctx.service.ads.removes(targetIds);
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },
};

module.exports = AdsController;
