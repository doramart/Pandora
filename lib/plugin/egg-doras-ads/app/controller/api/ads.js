/*
 * @Author: doramart 
 * @Date: 2019-09-26 09:19:25 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-08-22 23:58:57
 */
const _ = require('lodash');


let AdsController = {


    async getOne(ctx, app) {

        try {
            let name = ctx.query.name;

            if (!name) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let targetItem = await ctx.service.ads.item({
                query: {
                    name: name,
                    state: true
                },
                include: [{
                    as: 'items',
                    model: 'AdsItems'
                }]
            });

            ctx.helper.renderSuccess(ctx, {
                data: targetItem
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    }

}

module.exports = AdsController;