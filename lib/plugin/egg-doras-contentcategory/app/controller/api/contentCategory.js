'use strict';
const _ = require('lodash');
const fs = require('fs');
const { siteFunc } = require('../../utils');
const ContentCategoryController = {
  async list(ctx) {
    try {
      //   const payload = ctx.query;

      const queryObj = {
        enable: true,
      };

      // 获取当前默认模板信息
      const defaultTemp = await ctx.helper.reqJsonData(
        'contentTemplate/getDefaultTempInfo'
      );

      let contentCategoryList = await ctx.service.contentCategory.find(
        {
          isPaging: '0',
          // lean: '1'
        },
        {
          query: queryObj,
          include: [
            {
              as: 'contentTemp',
              model: 'TemplateItems',
            },
          ],
        }
      );

      let removeArr = [];

      contentCategoryList = contentCategoryList.map((node) =>
        node.get({
          plain: true,
        })
      );
      for (const item of contentCategoryList) {
        const cateContentsNum = await ctx.helper.reqJsonData(
          `content/getContentCountsByCateId?typeId=${item.id}`
        );
        item.postCount = cateContentsNum;
        if (!_.isEmpty(item.contentTemp)) {
          if (item.parentId !== 0 && item.contentTemp.forder) {
            const currentPath = `${process.cwd()}/app/view/${
              defaultTemp.alias
            }/${item.contentTemp.forder}`;
            // console.log('--currentPath--', currentPath)
            if (!fs.existsSync(currentPath)) {
              removeArr.push(item.id);
              removeArr.push(item.parentId);
            }
          }
        } else {
          // removeArr.push(item.id);
        }
      }

      removeArr = _.uniq(removeArr);

      // console.log('---contentCategoryList--', contentCategoryList);

      _.remove(contentCategoryList, function (cate) {
        return removeArr.indexOf(cate.id) >= 0;
      });

      ctx.helper.renderSuccess(ctx, {
        data: contentCategoryList,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async treelist(ctx) {
    const queryObj = {
      enable: true,
    };
    const typeId = ctx.query.typeId;

    const contentCategoryList = await ctx.service.contentCategory.find(
      {
        isPaging: '0',
      },
      {
        query: queryObj,
      }
    );
    // console.log('---contentCategoryList--', contentCategoryList)
    const newCateList = JSON.parse(JSON.stringify(contentCategoryList));
    let renderCates = siteFunc.buildTree(newCateList);
    if (typeId) {
      renderCates = _.filter(renderCates, (item) => {
        return item.id === Number(typeId);
      });
    }
    renderCates = _.sortBy(renderCates, function (item) {
      return item.sortId;
    });
    ctx.helper.renderSuccess(ctx, {
      data: renderCates,
    });
  },

  async getOne(ctx) {
    try {
      const id = ctx.query.id;
      const defaultUrl = ctx.query.defaultUrl;
      let queryObj = {};

      if (id) {
        queryObj = {
          id,
        };
      } else {
        if (defaultUrl) {
          queryObj = {
            defaultUrl,
          };
        } else {
          throw new Error(ctx.__('validate_error_params'));
        }
      }

      const targetItem = await ctx.service.contentCategory.item({
        query: queryObj,
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

  // 根据类别id或者文档id查询子类
  async getCurrentCategoriesById(ctx) {
    try {
      const contentId = ctx.query.contentId;
      const typeId = ctx.query.typeId;
      let cates = [],
        parents = [],
        contentObj;

      if (contentId) {
        contentObj = await ctx.service.content.item({
          query: {
            id: contentId,
          },
          // attributes: ['categories'],
          include: [
            {
              as: 'categories',
              attributes: ['name', 'id', '_id'],
              model: 'ContentCategory',
            },
          ],
        });
      }

      if (typeId || !_.isEmpty(contentObj)) {
        const fullNav = await ctx.service.contentCategory.find({
          isPaging: '0',
        });
        const parentTypeId = typeId
          ? Number(typeId)
          : contentObj.categories[0].id;

        const parentObj = _.filter(fullNav, (doc) => {
          return doc.id === parentTypeId;
        });

        if (parentObj.length > 0) {
          const parentId = parentObj[0].sortPath.split(',')[1] || 0;
          cates = _.filter(fullNav, (doc) => {
            return doc.sortPath.indexOf(parentId) > 0;
          });
          parents = _.filter(cates, (doc) => {
            return doc.parentId === 0;
          });
        }
      }

      ctx.helper.renderSuccess(ctx, {
        data: {
          parents,
          cates,
        },
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },
};

module.exports = ContentCategoryController;
