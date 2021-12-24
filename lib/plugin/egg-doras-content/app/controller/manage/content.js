'use strict';
const xss = require('xss');
const _ = require('lodash');
const { siteFunc } = require('../../utils');
const contentRule = (ctx) => {
  return {
    title: {
      type: 'string',
      required: true,
      min: 2,
      max: 50,
      message: ctx.__('validate_error_field', [ctx.__('label_content_title')]),
    },
    stitle: {
      type: 'string',
      required: true,
      min: 2,
      max: 50,
      message: ctx.__('validate_error_field', [ctx.__('label_content_stitle')]),
    },
    sImg: {
      type: 'string',
      required: true,
      message: ctx.__('validate_error_field', [ctx.__('lc_small_images')]),
    },
    discription: {
      type: 'string',
      required: true,
      min: 3,
      max: 300,
      message: ctx.__('validate_error_field', [ctx.__('label_content_dis')]),
    },
    comments: {
      type: 'string',
      required: true,
      min: 5,
      max: 100000,
      message: ctx.__('validate_inputCorrect', [
        ctx.__('label_content_comments'),
      ]),
    },
  };
};

const renderContentTags = async (ctx, fieldTags) => {
  let newTagArr = [];
  if (!_.isEmpty(fieldTags) && typeof fieldTags === 'object') {
    for (const tagItem of fieldTags) {
      const targetItem = await ctx.service.contentTag.item({
        query: {
          id: tagItem,
        },
      });
      if (_.isEmpty(targetItem)) {
        const thisItem = await ctx.service.contentTag.item({
          query: {
            name: tagItem,
          },
        });

        if (!_.isEmpty(thisItem)) {
          newTagArr.push(thisItem.id);
        } else {
          const newTag = await ctx.service.contentTag.create({
            name: tagItem,
            comments: tagItem,
          });
          newTagArr.push(newTag.id);
        }
      } else {
        newTagArr.push(tagItem);
      }
    }
  }

  if (_.isEmpty(newTagArr)) {
    newTagArr = fieldTags;
  }
  return newTagArr;
};

const ContentController = {
  async list(ctx, app) {
    try {
      const payload = ctx.query;
      const state = ctx.query.state;
      const uAuthor = ctx.query.uAuthor;
      const categories = ctx.query.categories;
      const draft = ctx.query.draft;
      const populateArr = [];
      const queryObj = {},
        searchParams = {};

      if (draft) {
        queryObj.draft = draft;
      } else {
        queryObj.draft = {
          [app.Sequelize.Op.ne]: '1',
        };
      }
      if (state) {
        queryObj.state = state;
      }
      if (uAuthor) {
        queryObj.author_id = uAuthor;
        searchParams.uAuthor = Number(uAuthor);
      }
      if (categories) {
        console.log('--categories--', categories);
        searchParams.categories = Number(categories);
        populateArr.push({
          as: 'categories',
          attributes: ['name', '_id', 'id', 'enable', 'defaultUrl'],
          model: 'ContentCategory',
          where: {
            id: categories,
          },
        });
      }

      const baseSql = {
        query: queryObj,
        searchKeys: ['stitle', 'title', 'comments', 'discription'],
        searchParams,
      };

      if (!_.isEmpty(populateArr)) {
        baseSql.include = populateArr;
      }

      const contentList = await ctx.service.content.find(payload, baseSql);

      ctx.helper.renderSuccess(ctx, {
        data: contentList,
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

      const newTagArr = await renderContentTags(ctx, fields.tags);

      const formObj = {
        title: fields.title,
        stitle: fields.stitle || fields.title,
        content_type: fields.content_type,
        categories: fields.categories,
        sortPath: fields.sortPath,
        tags: newTagArr,
        keywords: fields.keywords || '',
        sImg: fields.sImg,
        sImgType: fields.sImgType,
        cover: fields.cover,
        author: !_.isEmpty(ctx.session.adminUserInfo)
          ? ctx.session.adminUserInfo.id
          : '',
        state: fields.state,
        dismissReason: fields.dismissReason,
        isTop: fields.isTop,
        discription: xss(fields.discription),
        comments: fields.comments,
        likeUserIds: [],
        clickNum: 1,
      };

      if (fields.content_type === '1') {
        formObj.simpleComments = xss(fields.simpleComments);
      } else if (fields.content_type === '2' && fields.markDownComments) {
        formObj.markDownComments = fields.markDownComments;
        formObj.comments = fields.mdEditorHtml;
        formObj.simpleComments = fields.comments;
      }

      ctx.validate(contentRule(ctx), formObj);

      // 设置显示模式
      const checkInfo = siteFunc.checkContentType(formObj.simpleComments);
      formObj.appShowType = checkInfo.type;
      formObj.imageArr = checkInfo.imgArr;
      formObj.videoArr = checkInfo.videoArr;
      if (checkInfo.type === '3') {
        formObj.videoImg = checkInfo.defaultUrl;
      }
      formObj.simpleComments = siteFunc.renderSimpleContent(
        formObj.simpleComments,
        checkInfo.imgArr,
        checkInfo.videoArr
      );

      // 如果是管理员代发,则指定用户
      if (ctx.session.adminUserInfo && ctx.session.adminUserInfo.editor_id) {
        formObj.author_id = Number(ctx.session.adminUserInfo.editor_id);
      } else {
        throw new Error(ctx.__('validate_error_params'));
      }

      const newContent = await ctx.service.content.create(formObj);

      ctx.helper.addCategoryRecords(ctx, newContent.id, formObj.categories);
      ctx.helper.addTagRecords(ctx, newContent.id, formObj.tags);

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

      const targetContent = await ctx.service.content.item({
        query: {
          id,
        },
      });

      ctx.helper.renderSuccess(ctx, {
        data: targetContent,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  // 文章推荐
  async updateContentToTop(ctx) {
    try {
      const fields = ctx.request.body || {};
      if (!fields._id) {
        throw new Error(ctx.__('validate_error_params'));
      }
      await ctx.service.content.update(fields._id, {
        isTop: fields.isTop,
      });

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  // 文章置顶
  async roofPlacement(ctx) {
    try {
      const fields = ctx.request.body || {};
      await ctx.service.content.update(fields._id, {
        roofPlacement: fields.roofPlacement,
      });

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  // 给文章分配用户
  async redictContentToUsers(ctx) {
    try {
      const fields = ctx.request.body || {};
      let errMsg = '';
      const targetIds = fields.ids;
      const targetUser = fields.targetUser;

      if (isNaN(Number(targetUser))) {
        errMsg = ctx.__('validate_error_params');
      }

      if (errMsg) {
        throw new Error(errMsg);
      }

      await ctx.service.content.updateMany(targetIds, {
        author_id: targetUser,
      });

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async update(ctx) {
    try {
      const fields = ctx.request.body || {};

      const newTagArr = await renderContentTags(ctx, fields.tags);

      const formObj = {
        title: fields.title,
        stitle: fields.stitle || fields.title,
        content_type: fields.content_type,
        categories: fields.categories,
        sortPath: fields.sortPath,
        tags: newTagArr,
        keywords: fields.keywords ? fields.keywords : '',
        sImg: fields.sImg,
        sImgType: fields.sImgType,
        cover: fields.cover,
        author: !_.isEmpty(ctx.session.adminUserInfo)
          ? ctx.session.adminUserInfo.id
          : '',
        state: fields.state,
        dismissReason: fields.dismissReason,
        isTop: fields.isTop,
        discription: xss(fields.discription),
        comments: fields.comments,
      };

      if (fields.content_type === '1') {
        formObj.simpleComments = xss(fields.simpleComments);
      } else if (fields.content_type === '2' && fields.markDownComments) {
        formObj.markDownComments = fields.markDownComments;
        formObj.comments = fields.mdEditorHtml;
        formObj.simpleComments = fields.comments;
      }

      ctx.validate(contentRule(ctx), formObj);

      // 设置显示模式
      const checkInfo = siteFunc.checkContentType(formObj.simpleComments);
      formObj.appShowType = checkInfo.type;
      formObj.imageArr = checkInfo.imgArr;
      formObj.videoArr = checkInfo.videoArr;

      formObj.simpleComments = siteFunc.renderSimpleContent(
        formObj.simpleComments,
        checkInfo.imgArr,
        checkInfo.videoArr
      );

      if (checkInfo.type === '3') {
        formObj.videoImg = checkInfo.defaultUrl;
      }

      await ctx.service.content.update(fields.id, formObj);

      ctx.helper.addCategoryRecords(ctx, fields.id, formObj.categories);
      ctx.helper.addTagRecords(ctx, fields.id, formObj.tags);

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async updateContentEditor(ctx) {
    try {
      const fields = ctx.request.body || {};
      const formObj = {
        editor_id: fields.targetUser,
      };

      const oldUser = await ctx.service.user.item({
        query: {
          id: fields.targetUser,
        },
      });

      if (_.isEmpty(oldUser)) {
        throw new Error(ctx.__('validate_error_params'));
      }

      const adminUserInfo = ctx.session.adminUserInfo;

      await ctx.service.adminUser.update(adminUserInfo.id, formObj);

      ctx.session.adminUserInfo.editor_id = fields.targetUser;

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async moveCate(ctx) {
    try {
      const fields = ctx.request.body || {};

      if (!fields.ids || !fields.categories) {
        throw new Error(ctx.__('validate_error_params'));
      }
      const targetIds = fields.ids.split(',');
      for (const contentId of targetIds) {
          ctx.helper.addCategoryRecords(ctx, contentId, fields.categories);
      }

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
      const draft = ctx.query.draft;

      if (!checkCurrentId(targetIds)) {
        throw new Error(ctx.__('validate_error_params'));
      }

      if (draft === '1') {
        await ctx.service.content.safeDelete(targetIds, {
          draft: '1',
        });
      } else {
        await ctx.service.message.removes(targetIds, 'content_id');
        await ctx.service.content.removes(targetIds);
      }

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async updateContents(ctx) {
    try {
      const fields = ctx.request.body || {};

      const targetIds = fields.ids;
      const updates = fields.updates;

      if (!checkCurrentId(targetIds)) {
        throw new Error(ctx.__('validate_error_params'));
      }

      await ctx.service.content.updateMany(targetIds, updates);

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },
};

module.exports = ContentController;
