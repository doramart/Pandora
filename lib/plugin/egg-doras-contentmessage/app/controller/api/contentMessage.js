const xss = require("xss");
const _ = require('lodash');

const {
    siteFunc,
} = require('../../utils');


let ContentMessageController = {

    renderMessage(ctx, userInfo = {}, messages = []) {

        return new Promise(async (resolve, reject) => {
            try {

                let newMessageArr = JSON.parse(JSON.stringify(messages));
                for (const messageItem of newMessageArr) {

                    let had_comment = false;
                    let had_despises = false;
                    let had_praise = false;
                    if (!_.isEmpty(userInfo)) {
                        // 是否回复过
                        let myReplyRecord = await ctx.service.message.find({
                            isPaging: '0'
                        }, {
                            query: {
                                author: userInfo.id,
                                relationMsgId: messageItem.id
                            }
                        });
                        if (myReplyRecord.length > 0) {
                            had_comment = true;
                        }
                        // 是否踩过
                        if (userInfo.despiseMessage.indexOf(messageItem.id) >= 0) {
                            had_despises = true;
                        }
                        // 是否赞过
                        if (userInfo.praiseMessages.indexOf(messageItem.id) >= 0) {
                            had_praise = true;
                        }
                    }
                    let praise_num = await ctx.service.user.count({
                        praiseMessages: messageItem.id
                    });
                    let despises_num = await ctx.service.user.count({
                        despiseMessage: messageItem.id
                    });
                    messageItem.praise_num = praise_num;
                    messageItem.despises_num = despises_num;
                    messageItem.had_comment = had_comment;
                    messageItem.had_despises = had_despises;
                    messageItem.had_praise = had_praise;

                    let parentId = messageItem.id;
                    let childMessages = await ctx.service.message.find({
                        pageSize: 5,
                        isPaging: '0'
                    }, {
                        query: {
                            relationMsgId: parentId
                        }
                    })
                    if (!_.isEmpty(childMessages)) {
                        messageItem.childMessages = childMessages;
                    } else {
                        messageItem.childMessages = [];
                    }
                    messageItem.comment_num = await ctx.service.message.count({
                        relationMsgId: parentId
                    })

                }

                resolve(newMessageArr);
            } catch (error) {
                resolve(messages);
            }
        })
    },


    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let userId = ctx.query.userId;
            let contentId = ctx.query.contentId;
            let userInfo = ctx.session.user || {};
            let queryObj = {};
            let populateArr = [];

            if (userId) {
                // queryObj.author = userId
                populateArr.push({
                    as: 'author',
                    attributes: ['userName', '_id', 'id', 'enable', 'createdAt', 'logo'],
                    model: 'User',
                    where: {
                        id: userId
                    }
                })
            }

            if (contentId) {
                // queryObj.content_id = contentId
                populateArr.push({
                    as: 'contentId',
                    attributes: ['title', 'stitle', '_id', 'id', 'url'],
                    model: 'Content',
                    where: {
                        id: contentId
                    }
                })
            }

            let messageList = await ctx.service.message.find(payload, {
                query: queryObj,
                include: populateArr
            });

            if (!_.isEmpty(userInfo)) {
                userInfo = await ctx.service.user.item({
                    query: {
                        id: userInfo.id
                    },
                })
            }

            // messageList.docs = await this.renderMessage(ctx, userInfo, messageList.docs);

            ctx.helper.renderSuccess(ctx, {
                data: messageList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },


    /**
     * @api {post} /api/contentMessage/postMessages 帖子评论/留言
     * @apiDescription 帖子评论/留言，需要登录态
     * @apiName /contentMessage/postMessages
     * @apiGroup ContentMessage
     * @apiParam {string} token 登录时返回的参数鉴权
     * @apiParam {string} contentId 帖子ID
     * @apiParam {string} replyAuthor 回复者ID (二级留言必填)
     * @apiParam {string} relationMsgId 回复目标留言ID (二级留言必填)
     * @apiParam {string} content 评论内容
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *    "status": 200,
     *    "message": "操作成功！",
     *    "server_time": 1543372263586,
     *    "data": {}
     *}
     * @apiSampleRequest http://localhost:10003/api/contentMessage/postMessages
     * @apiVersion 1.0.0
     */
    async postMessages(ctx, app) {


        try {

            let fields = ctx.request.body;

            let errMsg = '';
            if (_.isEmpty(ctx.session.user) && _.isEmpty(ctx.session.adminUserInfo)) {
                errMsg = ctx.__("validate_error_params")
            }
            if (isNaN(Number(fields.contentId))) {
                errMsg = ctx.__("validate_message_add_err")
            }
            if (fields.content && (fields.content.length < 5 || fields.content.length > 200)) {
                errMsg = ctx.__("validate_rangelength", [ctx.__("label_messages_content"), 5, 200])
            }
            if (!fields.content) {
                errMsg = ctx.__("validate_inputNull", [ctx.__("label_messages_content")])
            }
            if (errMsg) {
                throw new Error(errMsg);
            }

            const messageObj = {
                content_id: fields.contentId,
                content: xss(fields.content),
                // replyAuthor_id: fields.replyAuthor ,
                // adminReplyAuthor_id: fields.adminReplyAuthor ,
                author_id: ctx.session.user.id,
                // relationMsgId: fields.relationMsgId,
                utype: fields.utype || '0',
            }

            if (fields.replyAuthor) {
                messageObj.replyAuthor_id = fields.replyAuthor;
            }
            if (fields.adminReplyAuthor) {
                messageObj.adminReplyAuthor_id = fields.adminReplyAuthor;
            }
            if (fields.relationMsgId) {
                messageObj.relationMsgId = fields.relationMsgId;
            }

            let targetMessage = await ctx.service.message.create(messageObj);

            // 给被回复用户发送提醒邮件
            const contentInfo = await ctx.service.content.item({
                query: {
                    id: fields.contentId
                }
            })

            let replyAuthor;

            if (fields.replyAuthor) {
                replyAuthor = await ctx.service.user.item({
                    query: {
                        id: fields.replyAuthor
                    },
                    attributes: ['id', 'userName', 'category', 'group', 'logo', 'createdAt', 'enable', 'state', 'email']
                })
            } else if (fields.adminReplyAuthor) {
                replyAuthor = await ctx.service.adminUser.item({
                    query: {
                        id: fields.adminReplyAuthor
                    },
                    attributes: ["id", "userName", "email"]
                })
            }

            if (!_.isEmpty(replyAuthor)) {
                await ctx.helper.reqJsonData('mailTemplate/sendEmail', {
                    tempkey: "6",
                    info: {
                        replyAuthor_id: replyAuthor,
                        content: contentInfo,
                        author_id: ctx.session.user
                    }
                }, "post");
            }

            // 发送消息给客户端
            // let passiveUser = fields.replyAuthor ? fields.replyAuthor : contentInfo.uAuthor;
            // siteFunc.addSiteMessage('3', ctx.session.user, passiveUser, targetMessage.id, {
            //     targetMediaType: '1'
            // });

            let returnMessage = await ctx.service.message.item({
                query: {
                    id: targetMessage.id
                }
            })


            ctx.helper.renderSuccess(ctx, {
                data: returnMessage
            });
        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    }


}

module.exports = ContentMessageController;