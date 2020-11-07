const _ = require('lodash');

let ContentTagController = {

    async list(ctx, app) {

        try {

            let payload = ctx.query;

            let queryObj = Object.assign({
                isPaging: '0'
            }, payload)

            let contentTagList = await ctx.service.contentTag.find(queryObj);

            ctx.helper.renderSuccess(ctx, {
                data: contentTagList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async hot(ctx, app) {
        try {
            let payload = ctx.query;
            let result = await ctx.service.contentTag.getHot(payload);
            ctx.helper.renderSuccess(ctx, {
                data: result
            });
        } catch (error) {
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }
    },


}

module.exports = ContentTagController;