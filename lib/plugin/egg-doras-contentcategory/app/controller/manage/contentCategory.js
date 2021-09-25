'use strict';
const _ = require('lodash');

const contentCategoryRule = (ctx) => {
  return {
    name: {
      type: 'string',
      required: true,
      min: 2,
      max: 20,
      message: ctx.__('validate_error_field', [ctx.__('label_cate_name')]),
    },
    defaultUrl: {
      type: 'string',
      required: true,
      message: ctx.__('validate_error_field', [ctx.__('label_cate_seourl')]),
    },
    comments: {
      type: 'string',
      required: true,
      min: 4,
      max: 100,
      message: ctx.__('validate_inputCorrect', [ctx.__('label_comments')]),
    },
  };
};

const ContentCategoryController = {
  async list(ctx) {
    try {
      const payload = ctx.query;
      const queryObj = {};

      const categoryParams = _.assign({}, payload, {
        isPaging: '0',
      });
      const contentCategoryList = await ctx.service.contentCategory.find(
        categoryParams,
        {
          searchKeys: ['name'],
          query: queryObj,
        }
      );

      ctx.helper.renderSuccess(ctx, {
        data: contentCategoryList,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async create(ctx, app) {
    try {
      const fields = ctx.request.body || {};
      const formObj = {
        name: fields.name,
        keywords: fields.keywords,
        sortId: fields.sortId,
        parentId: fields.parentId,
        enable: fields.enable,
        defaultUrl: fields.defaultUrl,
        content_temp: fields.content_temp,
        comments: fields.comments,
        sImg: fields.sImg,
        cate_type: fields.cate_type,
      };

      // 兼容中文逗号
      if (fields.keywords) {
        const reg = new RegExp('，', 'g');
        formObj.keywords = fields.keywords.replace(reg, ',');
      }

      // 针对子类自动继承父类的模板
      if (fields.parentId !== 0) {
        const parentCate = await ctx.service.contentCategory.item({
          query: {
            id: fields.parentId,
          },
        });
        if (!_.isEmpty(parentCate)) {
          formObj.content_temp = parentCate.content_temp;
        }
      }

      ctx.validate(contentCategoryRule(ctx), formObj);

      const cateObj = await ctx.service.contentCategory.create(formObj);
      // 更新sortPath defaultUrl
      const newQuery = {};
      if (fields.parentId === 0) {
        newQuery.sortPath = '0,' + cateObj.id;
      } else {
        const parentObj = await ctx.service.contentCategory.item({
          query: {
            id: fields.parentId,
          },
          attributes: ['sortPath', 'defaultUrl'],
        });
        newQuery.sortPath = parentObj.sortPath + ',' + cateObj.id;
        newQuery.defaultUrl = parentObj.defaultUrl + '/' + fields.defaultUrl;
      }
      await ctx.service.contentCategory.update(cateObj.id, newQuery);
      await app.getRoutes(ctx, 'update');
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

      const targetItem = await ctx.service.contentCategory.item({
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

  async alllist(ctx) {
    return await ctx.service.contentCategory.find({
      isPaging: '0',
    });
  },

  async update(ctx, app) {
    try {
      const fields = ctx.request.body || {};
      const formObj = {
        name: fields.name,
        keywords: fields.keywords,
        sortId: fields.sortId,
        parentId: fields.parentId,
        enable: fields.enable,
        defaultUrl: fields.defaultUrl,
        content_temp: fields.content_temp,
        sortPath: fields.sortPath,
        comments: fields.comments,
        sImg: fields.sImg,
        cate_type: fields.cate_type,
      };

      // 针对子类自动继承父类的模板
      if (fields.parentId === 0 && fields.content_temp) {
        await ctx.service.contentCategory.updateMany(
          '',
          {
            content_temp: fields.content_temp,
          },
          {
            parentId: fields.id,
          }
        );
      }

      ctx.validate(contentCategoryRule(ctx), formObj);

      await ctx.service.contentCategory.update(fields.id, formObj);
      await app.getRoutes(ctx, 'update');
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async removes(ctx, app) {
    try {
      const targetIds = ctx.query.ids;
      const contentCountInCates = await ctx.service.contentAndCategory.count({
        category_id: targetIds,
      });

      if (contentCountInCates > 0) {
        throw new Error('请先删除该分类下的文章！');
      } else {
        // 删除子类
        await ctx.service.contentCategory.removes(targetIds, 'parentId');
        // 删除主分类
        await ctx.service.contentCategory.removes(targetIds);

        await app.getRoutes(ctx, 'update');
        ctx.helper.renderSuccess(ctx);
      }
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },
};

module.exports = ContentCategoryController;
