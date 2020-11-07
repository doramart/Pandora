const _ = require('lodash');

const contentCategoryRule = (ctx) => {
    return {
        name: {
            type: "string",
            required: true,
            min: 2,
            max: 20,
            message: ctx.__("validate_error_field", [ctx.__("label_cate_name")])
        },
        defaultUrl: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("label_cate_seourl")])
        },
        comments: {
            type: "string",
            required: true,
            min: 4,
            max: 100,
            message: ctx.__("validate_inputCorrect", [ctx.__("label_comments")])
        }
    }
}



let ContentCategoryController = {

    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let queryObj = {};

            let categoryParams = _.assign({}, payload, {
                isPaging: '0'
            })
            let contentCategoryList = await ctx.service.contentCategory.find(categoryParams, {
                searchKeys: ['name'],
                query: queryObj
            });

            ctx.helper.renderSuccess(ctx, {
                data: contentCategoryList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async create(ctx, app) {


        try {

            let fields = ctx.request.body || {};
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
                cate_type: fields.cate_type
            }

            // 兼容中文逗号
            if (fields.keywords) {
                var reg = new RegExp('，', "g")
                formObj.keywords = (fields.keywords).replace(reg, ',');
            }

            // 针对子类自动继承父类的模板
            if (fields.parentId != '0') {
                let parentCate = await ctx.service.contentCategory.item({
                    query: {
                        'id': fields.parentId
                    }
                })
                if (!_.isEmpty(parentCate)) {
                    formObj.content_temp = parentCate.content_temp;
                }
            }

            ctx.validate(contentCategoryRule(ctx), formObj);

            let cateObj = await ctx.service.contentCategory.create(formObj);
            // 更新sortPath defaultUrl
            let newQuery = {};
            if (fields.parentId == '0') {
                newQuery.sortPath = '0,' + cateObj.id
            } else {
                let parentObj = await ctx.service.contentCategory.item({
                    query: {
                        'id': fields.parentId
                    },
                    attributes: ['sortPath', 'defaultUrl']
                })
                newQuery.sortPath = parentObj.sortPath + "," + cateObj.id;
                newQuery.defaultUrl = parentObj.defaultUrl + '/' + fields.defaultUrl
            }
            await ctx.service.contentCategory.update(cateObj.id, newQuery);
            await app.getRoutes(ctx, 'update');
            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },



    async getOne(ctx, app) {

        try {
            let id = ctx.query.id;

            let targetItem = await ctx.service.contentCategory.item({
                query: {
                    id: id
                }
            });

            ctx.helper.renderSuccess(ctx, {
                data: targetItem
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    async alllist(ctx, app) {
        return await ctx.service.contentCategory.find({
            isPaging: '0'
        })
    },


    async update(ctx, app) {


        try {

            let fields = ctx.request.body || {};
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
                cate_type: fields.cate_type
            }

            // 针对子类自动继承父类的模板
            if (fields.parentId == '0' && fields.content_temp) {
                await ctx.service.contentCategory.updateMany('', {
                    content_temp: fields.content_temp
                }, {
                    'parentId': fields.id
                })
            }

            ctx.validate(contentCategoryRule(ctx), formObj);

            await ctx.service.contentCategory.update(fields.id, formObj);
            await app.getRoutes(ctx, 'update');
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    async removes(ctx, app) {

        try {
            let targetIds = ctx.query.ids;
            let contentCountInCates = await ctx.service.content.count({
                categories: targetIds
            })

            if (contentCountInCates > 0) {
                throw new Error("请先删除该分类下的文章！");
            } else {
                // 删除主分类
                await ctx.service.contentCategory.removes(targetIds);
                // 删除子类
                await ctx.service.contentCategory.removes(targetIds, 'parentId');
                await app.getRoutes(ctx, 'update');
                ctx.helper.renderSuccess(ctx);
            }

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }

}

module.exports = ContentCategoryController;