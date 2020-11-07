const xss = require("xss");
const _ = require('lodash');

const {
    siteFunc,
    validatorUtil
} = require('../../utils');
const validator = require('validator');
const fs = require('fs');
const path = require('path');

const awaitStreamReady = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const mammoth = require("mammoth");
const moment = require("moment");
const await = require("await-stream-ready/lib/await");

let ContentController = {

    checkContentFormData(ctx, fields) {

        let errMsg = '';

        if (fields.id && !checkCurrentId(fields.id)) {
            errMsg = ctx.__("validate_error_params");
        }

        if (!validatorUtil.isRegularCharacter(fields.title)) {
            errMsg = ctx.__("validate_error_field", [ctx.__("label_content_title")]);
        }
        if (!validator.isLength(fields.title, 2, 50)) {
            errMsg = ctx.__("validate_rangelength", [ctx.__("label_content_title"), 2, 50]);
        }
        if (fields.stitle && !validator.isLength(fields.stitle, 2, 50)) {
            errMsg = ctx.__("validate_rangelength", [ctx.__("label_content_stitle"), 2, 50]);
        }
        if (!fields.tags) {
            errMsg = ctx.__("validate_selectNull", [ctx.__("label_content_tags")]);
        }

        if (!fields.categories) {
            errMsg = ctx.__("validate_userContent_category");
        }

        if (!fields.sImg) {
            errMsg = ctx.__("validate_selectNull", [ctx.__("lc_small_images")]);
        }

        if (!validator.isLength(fields.discription, 5, 300)) {
            errMsg = ctx.__("validate_rangelength", [ctx.__("label_content_dis"), 5, 300]);
        }

        if (fields.comments && !validator.isLength(fields.comments, 5, 100000)) {
            errMsg = ctx.__("validate_rangelength", [ctx.__("label_content_comments"), 5, 100000]);
        }

        if (errMsg) {
            throw new Error(errMsg);
        }

    },

    renderContentList(ctx, userId = "", contentList = []) {

        return new Promise(async (resolve, reject) => {
            try {

                let newContentList = JSON.parse(JSON.stringify(contentList));
                let userInfo;

                if (userId) {
                    userInfo = await ctx.service.user.item({
                        query: {
                            id: userId
                        },
                        // attributes: getAuthUserFields('session')
                    })
                }

                for (let contentItem of newContentList) {
                    contentItem.id = contentItem.id;
                    contentItem.hasPraised = false;
                    contentItem.hasComment = false;
                    contentItem.hasFavorite = false;
                    contentItem.hasDespise = false;
                    contentItem.uAuthor && (contentItem.uAuthor.had_followed = false);

                    // if (!_.isEmpty(userInfo)) {
                    //     // 本人是否已点赞
                    //     if (userInfo.praiseContents && userInfo.praiseContents.indexOf(contentItem.id) >= 0) {
                    //         contentItem.hasPraised = true;
                    //     }
                    //     // 本人是否已收藏
                    //     if (userInfo.favorites && userInfo.favorites.indexOf(contentItem.id) >= 0) {
                    //         contentItem.hasFavorite = true;
                    //     }
                    //     // 本人是否已踩
                    //     if (userInfo.despises && userInfo.despises.indexOf(contentItem.id) >= 0) {
                    //         contentItem.hasDespise = true;
                    //     }
                    //     // 本人是否已留言
                    //     let contentMessage = await ctx.service.message.item({
                    //         query: {
                    //             contentId: contentItem.id,
                    //             author: userInfo.id
                    //         }
                    //     })
                    //     if (!_.isEmpty(contentMessage)) {
                    //         contentItem.hasComment = true;
                    //     }
                    //     // 本人是否已关注作者
                    //     if (userInfo.watchers.length > 0 && contentItem.uAuthor && userInfo.watchers.indexOf(contentItem.uAuthor.id) >= 0) {
                    //         contentItem.uAuthor.had_followed = true;
                    //     }
                    // }

                    // 留言总数
                    // let commentNum = await ctx.service.message.count({
                    //     contentId: contentItem.id
                    // });
                    // contentItem.commentNum = contentItem.message.length;

                    // 点赞总数
                    // let likeNum = await ctx.service.user.count({
                    //     praiseContents: contentItem.id
                    // })
                    // contentItem.likeNum = likeNum;

                    // 收藏总数
                    // let favoriteNum = await ctx.service.user.count({
                    //     favorites: contentItem.id
                    // })
                    // contentItem.favoriteNum = favoriteNum;

                    // 踩帖总数
                    // let despiseNum = await ctx.service.user.count({
                    //     despises: contentItem.id
                    // });
                    // contentItem.despiseNum = despiseNum;

                    // if (contentItem.simpleComments) {
                    //     contentItem.simpleComments = JSON.parse(contentItem.simpleComments);
                    // }

                    // 处理用户敏感信息
                    // contentItem.uAuthor && siteFunc.clearUserSensitiveInformation(contentItem.uAuthor);

                }

                resolve(newContentList);
            } catch (error) {
                resolve([]);
            }
        })

    },

    // 根据类别id获取文档数量
    async getContentCountsByCateId(ctx, app) {

        let typeId = ctx.query.typeId;

        if (isNaN(Number(typeId))) {
            throw new Error(ctx.__('validate_error_params'));
        }

        let result = await ctx.service.contentAndCategory.count({
            'category_id': typeId
        });

        try {
            ctx.helper.renderSuccess(ctx, {
                data: result
            });
        } catch (error) {
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }

    },


    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let userId = ctx.query.userId;
            let userInfo = ctx.session.user || {};
            let model = ctx.query.model;
            let sortby = ctx.query.sortby;
            let listState = ctx.query.listState || '2';
            let defaultUrl = ctx.query.defaultUrl;
            let typeId = ctx.query.typeId;
            let tagName = ctx.query.tagName;
            let filesType = 'normal'; // 查询模式 full/normal/simple
            let isSingerPage = false; // 是否是单页面
            let targetUser;
            let populateArr = [];

            let queryObj = {
                    state: '2'
                },
                sortObj = [
                    ['created_at', 'desc']
                ];


            if (ctx.query.pageType == 'index') {
                // sortObj = {
                //     roofPlacement: -1,
                //     date: -1
                // };
                sortObj.unshift(['roof_placement', 'desc'])
            }

            if (model == '1') {
                queryObj.isTop = 1;
            }

            if (tagName) {
                let targetTag = await ctx.service.contentTag.item({
                    query: {
                        name: tagName
                    }
                });
                if (!_.isEmpty(targetTag)) {
                    populateArr.push({
                        as: 'tags',
                        attributes: ['name', '_id', 'id', 'url'],
                        model: 'ContentTag',
                        where: {
                            id: targetTag.id
                        }
                    })
                }
            }

            if (sortby == '1') { // 按点击量排序
                // delete sortObj.date;
                // delete sortObj.roofPlacement;
                // sortObj = {
                //     clickNum: 1
                // }
                sortObj = [
                    ['click_num', 'desc']
                ];
                // let rangeTime = getDateStr(-720);
                // queryObj.createdAt = {
                //     [app.Sequelize.Op.gte]: new Date(rangeTime.startTime),
                //     [app.Sequelize.Op.lte]: new Date(rangeTime.endTime)
                // }
            }

            // 如果是本人，返回所有文档
            if (!_.isEmpty(userInfo) && userInfo.id == userId) {
                // queryObj.uAuthor = userInfo.id;
                populateArr.push({
                    as: 'uAuthor',
                    attributes: ['userName', 'name', 'logo', '_id', 'id', 'group'],
                    model: 'User',
                    where: {
                        id: userInfo.id
                    }
                })
                if (listState == 'all') {
                    delete queryObj.state;
                } else {
                    if (listState == '0' || listState == '1' || listState == '2') {
                        queryObj.state = listState;
                    }
                }
            } else {
                if (userId) {
                    targetUser = await ctx.service.user.item({
                        query: {
                            id: userId
                        }
                    })
                    if (!_.isEmpty(targetUser)) {
                        // queryObj.uAuthor = targetUser.id;
                        populateArr.push({
                            as: 'uAuthor',
                            attributes: ['userName', 'name', 'logo', '_id', 'id', 'group'],
                            model: 'User',
                            where: {
                                id: targetUser.id
                            }
                        })
                    } else {
                        throw new Error(ctx.__('validate_error_params'));
                    }
                }
            }

            if (defaultUrl || typeId) {
                let typeQuery = defaultUrl ? {
                    defaultUrl
                } : {
                    id: typeId
                };
                populateArr.push({
                    as: 'categories',
                    attributes: ['name', '_id', 'id', 'enable', 'defaultUrl'],
                    model: 'ContentCategory',
                    where: Object.assign({
                        enable: true,
                        cate_type: ctx.query.cate_type ? ctx.query.cate_type : {
                            [app.Sequelize.Op.ne]: '2'
                        }
                    }, typeQuery)
                })
            }

            let baseSql = {
                sort: sortObj,
                query: queryObj,
                // attributes: getContentListFields(filesType),
                // searchKeys: ['userName', 'title', 'comments', 'discription'],
                include: populateArr
            }

            if (ctx.query.cate_type == '2') {
                // baseSql.attributes = {}
                // baseSql.attributes.exclude = ['simpleComments'];
                Object.assign(baseSql, {
                    attributes: {
                        exclude: ['simpleComments']
                    }
                })
            }

            if (userId) {
                // baseSql.attributes = [];
                // baseSql.attributes.include = [
                //     [app.Sequelize.literal('(SELECT COUNT(*) FROM `doracms`.`doracms_user_praise` WHERE `doracms`.`doracms_user_praise`.`user_id` = ' + userId + ' AND `doracms`.`doracms_user_praise`.`cotent_id` = ' + ctx.service.content.id + ')'), 'PraiseCount']
                // ]
            }
            let contentList = await ctx.service.content.find(payload, baseSql);

            // contentList.docs = await this.renderContentList(ctx, userInfo.id, contentList.docs);
            // contentList.docs = contentList;
            if (queryObj.uAuthor) {
                contentList.author = targetUser;
            }
            ctx.helper.renderSuccess(ctx, {
                data: contentList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async getTopIndexContents(ctx, app) {

        try {
            let current = ctx.query.current || 1;
            let pageSize = ctx.query.pageSize || 10;
            let model = ctx.query.model || 'normal'; // 查询模式 full/normal/simple
            let userInfo = ctx.session.user || {};
            let payload = ctx.query;

            // 条件配置
            let queryObj = {
                state: '2',
                isTop: 1,
                uAuthor: {
                    [app.Sequelize.Op.ne]: null
                }
            };

            let sortObj = [
                ['roof_placement', 'desc']
            ];

            let recContents = [];

            if (!_.isEmpty(userInfo) && !_.isEmpty(userInfo.watchTags) && userInfo.watchTags.length > 0) {
                // 查询置顶文章
                let tagQuery = {
                    state: '2',
                    [app.Sequelize.Op.or]: [{
                        roofPlacement: 1
                    }, {
                        tags: {
                            [app.Sequelize.Op.in]: userInfo.watchTags
                        }
                    }]
                };

                let recContentsNum = await ctx.service.content.count(tagQuery);
                recContents = await ctx.service.content.find(payload, {
                    query: tagQuery,
                    attributes: getContentListFields(),
                    sort: sortObj
                })

                if (recContentsNum > current * pageSize) {
                    recContents.docs = await this.renderContentList(ctx, userInfo.id, recContents.docs);
                    ctx.helper.renderSuccess(ctx, {
                        data: recContents
                    });
                } else {

                    let leftNormalSize = current * pageSize - recContentsNum;
                    if (leftNormalSize <= pageSize) {

                        if (leftNormalSize > 0) {
                            let leftContents = await ctx.service.content.find({
                                current: 1,
                                pageSize: Number(leftNormalSize)
                            }, {
                                query: {
                                    state: '2',
                                    tags: {
                                        $nin: userInfo.watchTags
                                    }
                                },
                                attributes: getContentListFields(),
                                sort: sortObj
                            })
                            recContents = _.concat(recContents, leftContents);
                        }

                    } else {

                        let leftContents = await ctx.service.content.find({
                            skip: leftNormalSize,
                            pageSize: Number(pageSize)
                        }, {
                            query: {
                                state: '2',
                                tags: {
                                    $nin: userInfo.watchTags
                                }
                            },
                            attributes: getContentListFields(),
                            sort: sortObj
                        })
                        recContents = _.concat(recContents, leftContents);
                    }

                    recContents.docs = await renderContentList(ctx, userInfo.id, recContents.docs);

                    ctx.helper.renderSuccess(ctx, {
                        data: recContents
                    });

                }

            } else {
                let contents = await ctx.service.content.find(payload, {
                    query: queryObj,
                    attributes: getContentListFields(),
                    sort: sortObj
                })
                contents.docs = await this.renderContentList(ctx, userInfo.id, contents.docs);

                ctx.helper.renderSuccess(ctx, {
                    data: contents
                });
            }

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    async getRadomContents(ctx, app) {

        let payload = ctx.query;

        let queryObj = {
            content_type: '1',
            state: '2'
        };
        let populateArr = [{
            as: 'categories',
            attributes: ['name', '_id', 'id', 'enable', 'defaultUrl', 'url', 'parentId'],
            model: 'ContentCategory',
            where: {
                enable: true,
                cate_type: '1'
            }
        }]
        let randomArticles = [];
        try {

            const totalContents = await ctx.service.content.count(queryObj);
            randomArticles = await ctx.service.content.find(_.assign(payload, {
                skip: Math.floor(totalContents * Math.random())
            }), {
                query: queryObj,
                include: populateArr,
                attributes: ['stitle', 'sImg', 'title', '_id', 'id', 'url', 'createdAt', 'updatedAt']
            })

            ctx.helper.renderSuccess(ctx, {
                data: randomArticles
            });
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },


    async getOneContent(ctx, app) {

        try {
            let targetId = ctx.query.id;
            let userId = ctx.query.userId;

            if (isNaN(Number(targetId))) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let queryObj = {
                id: targetId,
                state: '2',
                author_id: {
                    [app.Sequelize.Op.ne]: null
                }
            };

            let userInfo = ctx.session.user || {};

            // 查询自己的文章不需要约束状态
            if (!_.isEmpty(userInfo) && userInfo.id == userId) {
                delete queryObj.state;
                queryObj.author_id = userId;
            }

            let targetContent = await ctx.service.content.item({
                query: queryObj,
                // attributes: getContentListFields()
            });

            if (_.isEmpty(targetContent)) {
                throw new Error(ctx.__('label_page_404'));
            } else {
                await ctx.service.content.inc(targetId, {
                    'click_num': 1
                })
            }

            ctx.helper.renderSuccess(ctx, {
                data: targetContent
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },


    async getNearbyContent(ctx, app) {

        try {
            let contentId = ctx.query.id;

            if (!contentId) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let targetContent = await ctx.service.content.item({
                query: {
                    id: contentId
                },
                attributes: ['title', '_id', 'id', 'createdAt', 'updatedAt']
            });

            if (_.isEmpty(targetContent)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let preContent = await ctx.service.content.find({
                isPaging: '0',
                pageSize: 1
            }, {
                query: {
                    id: {
                        [app.Sequelize.Op.ne]: targetContent.id
                    },
                    state: '2',
                    updatedAt: {
                        [app.Sequelize.Op.lte]: new Date(targetContent.updatedAt)
                    }
                },
                attributes: ['title', '_id', 'id', 'createdAt', 'updatedAt', 'sImg', 'discription', 'url']
            });

            let nextContent = await ctx.service.content.find({
                isPaging: '0',
                pageSize: 1
            }, {
                query: {
                    id: {
                        [app.Sequelize.Op.ne]: targetContent.id
                    },
                    state: '2',
                    updatedAt: {
                        [app.Sequelize.Op.gte]: new Date(targetContent.updatedAt)
                    }
                },
                sort: [
                    ['updated_at', 'desc']
                ],
                attributes: ['title', '_id', 'id', 'createdAt', 'updatedAt', 'sImg', 'discription', 'url']
            });

            ctx.helper.renderSuccess(ctx, {
                data: {
                    preContent: !_.isEmpty(preContent) ? preContent[0] : [],
                    nextContent: !_.isEmpty(nextContent) ? nextContent[0] : []
                }
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    async getMyFavoriteContents(ctx, app) {

        try {

            let payload = ctx.query;
            let userInfo = ctx.session.user;

            let queryObj = {
                state: '2'
            };

            if (_.isEmpty(userInfo)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let favoriteContentsData = await ctx.service.content.find(payload, {
                query: queryObj,
                searchKeys: ['name'],
                attributes: getContentListFields(),
                include: [{
                    as: 'favorite',
                    model: 'User',
                    attributes: ['userName', 'logo', 'id', '_id'],
                    where: {
                        id: userInfo.id
                    }
                }]
            })

            ctx.helper.renderSuccess(ctx, {
                data: favoriteContentsData
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async addContent(ctx, app) {


        try {

            let fields = ctx.request.body;

            this.checkContentFormData(ctx, fields);

            const contentFormObj = {
                title: fields.title,
                stitle: fields.stitle,
                content_type: fields.type,
                categories: fields.categories,
                sortPath: fields.sortPath,
                tags: fields.tags,
                keywords: fields.keywords || '',
                sImg: fields.sImg,
                state: fields.state,
                dismissReason: fields.dismissReason,
                isTop: fields.isTop,
                discription: xss(fields.discription),
                comments: fields.comments,
                simpleComments: xss(fields.simpleComments),
                likeUserIds: [],
                content_type: fields.type
            }

            // 设置显示模式
            let checkInfo = siteFunc.checkContentType(contentFormObj.simpleComments);
            contentFormObj.appShowType = checkInfo.type;
            contentFormObj.imageArr = checkInfo.imgArr;
            contentFormObj.videoArr = checkInfo.videoArr;
            if (checkInfo.type == '3') {
                contentFormObj.videoImg = checkInfo.defaultUrl;
            }

            contentFormObj.simpleComments = siteFunc.renderSimpleContent(contentFormObj.simpleComments, checkInfo.imgArr, checkInfo.videoArr);

            // TODO 临时控制普通用户添加1天内不超过30篇
            let rangeTime = getDateStr(-1);
            let hadAddContentsNum = await ctx.service.content.count({
                author_id: ctx.session.user.id,
                createdAt: {
                    [app.Sequelize.Op.gte]: new Date(rangeTime.startTime),
                    [app.Sequelize.Op.lte]: new Date(rangeTime.endTime)
                }
            });

            if (hadAddContentsNum > 30) {
                throw new Error(ctx.__("validate_forbid_more_req"));
            }

            contentFormObj.comments = xss(fields.comments);
            contentFormObj.tags = Array(contentFormObj.tags);
            contentFormObj.stitle = contentFormObj.title;
            contentFormObj.author_id = ctx.session.user.id;
            if (fields.draft == '1') {
                contentFormObj.state = '0'
            } else {
                contentFormObj.state = '1'
            }
            contentFormObj.author = '';

            let newContent = await ctx.service.content.create(contentFormObj);


            ctx.helper.addCategoryRecords(ctx, newContent.id, contentFormObj.categories);
            ctx.helper.addTagRecords(ctx, newContent.id, contentFormObj.tags);

            ctx.helper.renderSuccess(ctx, {
                data: {
                    id: newContent.id
                }
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },

    async updateContent(ctx, app) {


        try {

            let fields = ctx.request.body;

            this.checkContentFormData(ctx, fields);

            let targetContent = await ctx.service.content.item({
                query: {
                    author_id: ctx.session.user.id
                }
            })

            if (_.isEmpty(targetContent)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            const contentObj = {
                title: fields.title,
                stitle: fields.stitle || fields.title,
                content_type: fields.type,
                categories: fields.categories,
                sortPath: fields.sortPath,
                tags: fields.tags,
                keywords: fields.keywords || '',
                sImg: fields.sImg,
                author: !_.isEmpty(ctx.session.adminUserInfo) ? ctx.session.adminUserInfo.id : '',
                state: fields.state,
                dismissReason: fields.dismissReason,
                isTop: fields.isTop,
                discription: xss(fields.discription),
                comments: fields.comments,
                simpleComments: xss(fields.simpleComments),
                content_type: fields.type
            }

            // 设置显示模式
            let checkInfo = siteFunc.checkContentType(contentObj.simpleComments);
            contentObj.appShowType = checkInfo.type;
            contentObj.imageArr = checkInfo.imgArr;
            contentObj.videoArr = checkInfo.videoArr;

            contentObj.simpleComments = siteFunc.renderSimpleContent(contentObj.simpleComments, checkInfo.imgArr, checkInfo.videoArr);

            if (checkInfo.type == '3') {
                contentObj.videoImg = checkInfo.defaultUrl;
            }

            contentObj.comments = xss(fields.comments);
            contentObj.stitle = contentObj.title;
            contentObj.uAuthor = ctx.session.user.id;

            if (fields.draft == '1') {
                contentObj.state = '0'
            } else {
                contentObj.state = '1'
            }
            contentObj.author = '';

            await ctx.service.content.update(fields.id, contentObj);

            ctx.helper.addCategoryRecords(ctx, fields.id, contentObj.categories);
            ctx.helper.addTagRecords(ctx, fields.id, contentObj.tags);

            ctx.helper.renderSuccess(ctx, {
                data: {}
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },

    async getWordHtmlContent(ctx, app) {
        try {

            // 获取 steam
            const stream = await ctx.getFileStream();

            // 上传基础目录
            let uploadOptions = app.config.doraUploadFile.uploadFileFormat;
            const uplaodBasePath = uploadOptions.upload_path + '/upload';
            const dayStr = moment().format('YYYYMMDD');

            if (!fs.existsSync(uplaodBasePath)) {
                fs.mkdirSync(uplaodBasePath);
            }
            // 保存路径
            let savePath = path.join(uplaodBasePath, 'file');
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath);
            }

            savePath = path.join(uplaodBasePath, 'file', dayStr);
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath);
            }

            // 生成文件名
            var basename = path.basename(stream.filename);
            basename = basename.substring(0, basename.lastIndexOf('.') - 1);

            const filename = basename + '_' + Date.now() + '_' + Number.parseInt(Math.random() * 10000) + path.extname(stream.filename);

            // 生成写入路径 
            const target = path.join(savePath, filename);

            // 写入流
            const writeStream = fs.createWriteStream(target);

            try {
                // 写入文件
                await awaitStreamReady(stream.pipe(writeStream));

                savePath = path.join(uplaodBasePath, 'images');
                if (!fs.existsSync(savePath)) {
                    fs.mkdirSync(savePath);
                }

                savePath = path.join(uplaodBasePath, 'images', dayStr);
                if (!fs.existsSync(savePath)) {
                    fs.mkdirSync(savePath);
                }

                var options = {
                    convertImage: mammoth.images.imgElement(function (image) {
                        var fileType = image.contentType.toLowerCase();
                        fileType = fileType.substring(fileType.indexOf('/') + 1);

                        const imageName = Date.now() + '' + Number.parseInt(Math.random() * 10000) + "." + fileType;
                        const imageFullName = path.join(savePath, imageName);

                        return image.read("base64").then(async function (imageBuffer) {
                            var dataBuffer = new Buffer(imageBuffer, 'base64');
                            fs.writeFileSync(imageFullName, dataBuffer, "binary");
                            let resultPath = `${app.config.static.prefix}/upload/images/${dayStr}/${imageName}`;
                            let uploadResult = await ctx.helper.reqJsonData('upload/filePath', {
                                imgPath: resultPath,
                                localImgPath: imageFullName,
                                filename: imageName
                            }, "post");
                            // console.log('---uploadResult--', uploadResult);
                            return {
                                src: uploadResult.path
                            };
                        });
                    })
                };

                var result = await mammoth.convertToHtml({
                    path: target
                }, options);

                var html = result.value;

                ctx.helper.renderSuccess(ctx, {
                    data: html
                });

            } catch (err) {
                // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
                await sendToWormhole(stream);
                throw err;
            }
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    // 获取封面背景图列表
    async getContentCoverList(ctx, app) {

        try {

            let queryObj = ctx.query || {};
            let coverList = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/contentCover/getList', queryObj);

            ctx.helper.renderSuccess(ctx, {
                data: coverList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },

    // 获取单个封面信息
    async getOneContentCover(ctx, app) {

        try {

            let queryObj = ctx.query || {};
            let coverObj = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/contentCover/getOne', queryObj);

            ctx.helper.renderSuccess(ctx, {
                data: coverObj
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    // 获取封面背景图类别列表
    async getContentCoverTypeList(ctx, app) {

        try {

            let payload = {};
            let coverTypeList = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/coverType/getList', payload);

            ctx.helper.renderSuccess(ctx, {
                data: coverTypeList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },

    // 上传base64合成后的背景图
    async uploadPreviewImgByBase64(ctx, app) {

        try {

            let fields = ctx.request.body || {};
            if (!fields.base64) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let uploadOptions = app.config.doraUploadFile.uploadFileFormat;
            const uplaodBasePath = uploadOptions.upload_path + '/upload';
            const dayStr = moment().format('YYYYMMDD');

            let savePath = path.join(uplaodBasePath, 'images');
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath);
            }

            savePath = path.join(uplaodBasePath, 'images', dayStr);
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath);
            }

            const imageName = Date.now() + '' + Number.parseInt(Math.random() * 10000) + ".png";
            const imageFullName = path.join(savePath, imageName);

            var dataBuffer = new Buffer(fields.base64, 'base64');

            fs.writeFileSync(imageFullName, dataBuffer, "binary");
            let resultPath = `${app.config.static.prefix}/upload/images/${dayStr}/${imageName}`;
            let uploadResult = await ctx.helper.reqJsonData('upload/filePath', {
                imgPath: resultPath,
                localImgPath: imageFullName,
                filename: imageName
            }, "post");

            ctx.helper.renderSuccess(ctx, {
                data: uploadResult.path
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    // 随机获取图片
    async getRandomContentImg(ctx, app) {

        try {

            let payload = ctx.query;
            let pageSize = ctx.query.pageSize || 1;
            let queryObj = {
                content_type: '1',
                state: '2'
            };

            let populateArr = [{
                as: 'categories',
                attributes: ['name', '_id', 'id', 'enable', 'defaultUrl', 'url', 'parentId'],
                model: 'ContentCategory',
                where: {
                    enable: true,
                    cate_type: '1'
                }
            }]

            const totalContents = await ctx.service.content.count(queryObj);
            let randomArticles = await ctx.service.content.find(_.assign(payload, {
                isPaging: '0',
                pageSize,
                skip: Math.floor(totalContents * Math.random())
            }), {
                query: queryObj,
                include: populateArr,
                attributes: ['sImg', 'createdAt', 'updatedAt']
            })

            let sImgArr = [];

            for (const articleItem of randomArticles) {
                if (articleItem.sImg) {
                    sImgArr.push(articleItem.sImg);
                }
            }

            ctx.helper.renderSuccess(ctx, {
                data: sImgArr
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

}

module.exports = ContentController;