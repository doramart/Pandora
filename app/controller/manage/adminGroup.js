/*
 * @Author: doramart 
 * @Date: 2019-06-20 18:55:40 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-08-15 00:01:22
 */
const Controller = require('egg').Controller;


const {
    adminGroupRule
} = require('@validate')

const _ = require('lodash');

class AdminGroupController extends Controller {
    async list() {
        const {
            ctx,
            service
        } = this;
        try {

            let payload = ctx.query;
            let adminGroupList = await ctx.service.adminGroup.find(payload);

            ctx.helper.renderSuccess(ctx, {
                data: adminGroupList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    }

    async create() {

        const {
            ctx,
            service
        } = this;
        try {


            let fields = ctx.request.body || {};

            const formObj = {
                name: fields.name,
                comments: fields.comments,
                power: 0
            }


            ctx.validate(adminGroupRule.form(ctx), formObj);



            await ctx.service.adminGroup.create(formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    }



    async getOne() {
        const {
            ctx,
            service
        } = this;
        try {
            let id = ctx.query.id;

            let targetGroup = await ctx.service.adminGroup.item({
                query: {
                    id: id
                }
            });

            ctx.helper.renderSuccess(ctx, {
                data: targetGroup
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    }


    async update() {

        const {
            ctx,
            service
        } = this;
        try {

            let fields = ctx.request.body || {};
            let currentPower = fields.power;

            const formObj = {
                name: fields.name,
                comments: fields.comments
            }

            if (!_.isEmpty(currentPower)) {
                if (typeof currentPower == 'object') {
                    currentPower = (fields.power).join(',');
                }
                formObj.power = currentPower;
            }

            ctx.validate(adminGroupRule.form(ctx), formObj);

            await ctx.service.adminGroup.update(fields.id, formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }


    }


    async removes() {
        const {
            ctx,
            service
        } = this;
        try {
            let targetIds = ctx.query.ids;
            await ctx.service.adminGroup.removes(targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }
}

module.exports = AdminGroupController;