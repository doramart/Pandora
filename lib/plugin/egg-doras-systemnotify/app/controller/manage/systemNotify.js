const _ = require('lodash');

const systemNotifyRule = (ctx) => {
    return {
        name: {
            type: "string",
            required: true,
            min: 1,
            max: 12,
            message: ctx.__("validate_error_field", [ctx.__("label_tag_name")])
        },
        comments: {
            type: "string",
            required: true,
            min: 2,
            max: 30,
            message: ctx.__("validate_inputCorrect", [ctx.__("label_comments")])
        }
    }
}



let SystemNotifyController = {

    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let userNotifyList = await ctx.service.systemNotify.find(payload, {
                query: {
                    admin_userid: ctx.session.adminUserInfo.id
                },
                include: [{
                    as: 'notify',
                    attributes: ['title', 'content', '_id', 'id']
                }]
            });

            ctx.helper.renderSuccess(ctx, {
                data: userNotifyList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },




    async getOne(ctx, app) {

        try {
            let id = ctx.query.id;

            let targetUser = await ctx.service.systemNotify.item({
                query: {
                    id: id
                }
            });

            ctx.helper.renderSuccess(ctx, {
                data: targetUser
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },



    async removes(ctx, app) {

        try {
            let targetIds = ctx.query.ids;
            if (!checkCurrentId(targetIds)) {
                throw new Error(ctx.__("validate_error_params"));
            } else {

                let ids = targetIds.split(',');
                // 删除消息记录
                for (let i = 0; i < ids.length; i++) {
                    const userNotifyId = ids[i];
                    let userNotifyObj = await ctx.service.systemNotify.item({
                        query: {
                            'id': userNotifyId
                        }
                    })
                    if (!_.isEmpty(userNotifyObj)) {
                        await ctx.service.notify.removes(userNotifyObj.notify);
                    }
                }

            }

            await ctx.service.systemNotify.removes(targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },


    async setMessageHasRead(ctx, app) {


        try {
            let targetIds = ctx.query.ids;

            if (!checkCurrentId(targetIds)) {
                throw new Error(ctx.__("validate_error_params"));
            } else {
                targetIds = targetIds.split(',');
            }

            await ctx.service.systemNotify.updateMany(targetIds, {
                'isRead': true
            }, {
                query: {
                    admin_userid: ctx.session.adminUserInfo.id
                }
            });

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    }
}

module.exports = SystemNotifyController;