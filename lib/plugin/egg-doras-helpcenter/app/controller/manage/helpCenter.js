const xss = require("xss");
const _ = require('lodash');

const helpCenterRule = (ctx) => {
    return {
        name: {
            type: "string",
            required: true,
            min: 1,
            max: 50,
            message: ctx.__("validate_error_field", [ctx.__("label_tag_name")])
        },
        comments: {
            type: "string",
            required: true,
            min: 2,
            max: 200000,
            message: ctx.__("validate_inputCorrect", [ctx.__("label_comments")])
        }
    }
}


let HelpCenterController = {

    async list(ctx) {

        try {

            let payload = ctx.query;
            let helpType = ctx.query.helpType;
            let queryObj = {};

            if (helpType) {
                queryObj.help_type = helpType;
            }

            let helpCenterList = await ctx.service.helpCenter.find(payload, {
                query: queryObj,
                searchKeys: ['name'],
                include: [{
                    as: 'user',
                    attributes: ['name', 'userName', 'id', '_id'],
                    model: 'AdminUser'
                }]
            });

            ctx.helper.renderSuccess(ctx, {
                data: helpCenterList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async create(ctx) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {
                name: fields.name,
                help_type: fields.help_type,
                lang: fields.lang,
                state: fields.state,
                admin_userid: ctx.session.adminUserInfo.id,
                comments: xss(fields.comments)
            }


            ctx.validate(helpCenterRule(ctx), formObj);



            await ctx.service.helpCenter.create(formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    async getOne(ctx) {

        try {
            let id = ctx.query.id;

            let targetItem = await ctx.service.helpCenter.item({
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


    async update(ctx) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {
                name: fields.name,
                state: fields.state,
                lang: fields.lang,
                help_type: fields.help_type,
                admin_userid: ctx.session.adminUserInfo.id,
                comments: xss(fields.comments),
            }


            ctx.validate(helpCenterRule(ctx), formObj);



            await ctx.service.helpCenter.update(fields.id, formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    async removes(ctx) {

        try {
            let targetIds = ctx.query.ids;
            await ctx.service.helpCenter.removes(targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

}

module.exports = HelpCenterController;