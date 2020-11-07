/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-10-04 22:07:16
 */

'use strict';
const Service = require('egg').Service;
const path = require('path')
const _ = require('lodash')

// general是一个公共库，可用可不用
const {
    _list,
    _item,
    _count,
    _create,
    _update,
    _removes,
    _safeDelete,
    _updateMany,
    _inc,
} = require(path.join(process.cwd(), 'app/service/general'));

class ContentService extends Service {

    async find(payload, {
        sort = [
            ['created_at', 'desc']
        ],
        query = {},
        searchKeys = [],
        searchParams = {},
        include = [],
        attributes = null
    } = {}) {
        if ((this.ctx.originalUrl).indexOf('/manage/content/') != 0) {
            Object.assign(query, {
                draft: {
                    [this.app.Sequelize.Op.ne]: '1'
                }
            });
        }
        let statisticsNumAttr = [
            // 评论数
            [this.app.Sequelize.literal(`(
            SELECT COUNT(*)
            FROM doracms_message AS message
            WHERE
            message.content_id = content.id
            )`), 'commentNum'],
            // 点赞总数
            [this.app.Sequelize.literal(`(
            SELECT COUNT(*)
            FROM doracms_user_praise_content AS user_praise_content
            WHERE
            user_praise_content.content_id = content.id
            )`), 'likeNum'],
            // 收藏总数
            [this.app.Sequelize.literal(`(
            SELECT COUNT(*)
            FROM doracms_user_favorite_content AS user_favorite_content
            WHERE
            user_favorite_content.content_id = content.id
            )`), 'favoriteNum'],
            // 踩帖总数
            [this.app.Sequelize.literal(`(
            SELECT COUNT(*)
            FROM doracms_user_despise_content AS user_despise_content
            WHERE
            user_despise_content.content_id = content.id
            )`), 'despiseNum'],
        ]
        if (attributes == null) {
            attributes = {}
        }
        attributes.include = statisticsNumAttr;
        if (_.isEmpty(attributes.exclude)) {
            attributes.exclude = ['comments', 'simpleComments'];
        }

        let listdata = _list(this, this.ctx.model.Content, payload, {
            attributes: attributes,
            query: query,
            searchKeys: ['stitle', 'title', 'comments', 'discription'].concat(searchKeys),
            searchParams,
            include: concatPopulate([{
                    as: 'uAuthor',
                    attributes: ['userName', 'name', 'logo', '_id', 'id', 'group'],
                    model: "User"
                },
                {
                    as: 'tags',
                    attributes: ['name', '_id', 'id', 'url'],
                    model: 'ContentTag'
                },
                {
                    as: 'categories',
                    attributes: ['name', '_id', 'id', 'enable', 'defaultUrl', 'url', 'parentId'],
                    model: 'ContentCategory'
                }
            ], include),
            sort: sort
        });

        return listdata;

    }


    async count(params = {}) {
        return _count(this, this.ctx.model.Content, params);
    }

    async create(payload) {
        return _create(this, this.ctx.model.Content, payload);
    }

    async removes(values, key = 'id') {
        return _removes(this, this.ctx.model.Content, values, key);
    }

    async safeDelete(values, updateObj = {}) {
        return _safeDelete(this, this.ctx.model.Content, values, updateObj);
    }

    async update(id, payload) {
        return _update(this, this.ctx.model.Content, id, payload);
    }

    async inc(id, payload) {
        return _inc(this, this.ctx.model.Content, id, payload);
    }

    async updateMany(ids, data, query = {}) {
        return _updateMany(this, this.ctx.model.Content, ids, data, query);
    }

    async item({
        query = {},
        include = [],
        attributes = null
    } = {}) {
        let statisticsNumAttr = [
            // 评论数
            [this.app.Sequelize.literal(`(
                SELECT COUNT(*)
                FROM doracms_message AS message
                WHERE
                message.content_id = content.id
                )`), 'commentNum'],
            // 点赞总数
            [this.app.Sequelize.literal(`(
                SELECT COUNT(*)
                FROM doracms_user_praise_content AS user_praise_content
                WHERE
                user_praise_content.content_id = content.id
                )`), 'likeNum'],
            // 收藏总数
            [this.app.Sequelize.literal(`(
                SELECT COUNT(*)
                FROM doracms_user_favorite_content AS user_favorite_content
                WHERE
                user_favorite_content.content_id = content.id
                )`), 'favoriteNum'],
            // 踩帖总数
            [this.app.Sequelize.literal(`(
                SELECT COUNT(*)
                FROM doracms_user_despise_content AS user_despise_content
                WHERE
                user_despise_content.content_id = content.id
                )`), 'despiseNum'],
        ]
        if (attributes == null) {
            attributes = {}
        }
        attributes.include = statisticsNumAttr;
        if (_.isEmpty(attributes.exclude)) {
            attributes.exclude = ['simpleComments'];
        }
        return _item(this, this.ctx.model.Content, {
            attributes: attributes,
            query: query,
            include: concatPopulate([{
                    as: 'uAuthor',
                    attributes: ['userName', 'name', 'logo', '_id', 'id', 'group'],
                    model: "User"
                },
                {
                    as: 'tags',
                    attributes: ['name', '_id', 'id', 'url'],
                    model: 'ContentTag'
                },
                {
                    as: 'categories',
                    attributes: ['name', '_id', 'id', 'enable', 'defaultUrl', 'url', 'parentId'],
                    model: 'ContentCategory'
                }
            ], include),

        })
    }


}

module.exports = ContentService;