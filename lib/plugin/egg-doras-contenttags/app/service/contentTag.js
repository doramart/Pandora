/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-10-01 21:22:40
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
    _safeDelete
} = require(path.join(process.cwd(), 'app/service/general'));


class ContentTagService extends Service {

    async find(payload, {
        query = {},
        searchKeys = [],
        include = [],
        attributes = null
    } = {}) {

        let listdata = _list(this, this.ctx.model.ContentTag, payload, {
            query: query,
            searchKeys: searchKeys,
            include: include,
            attributes
        });
        return listdata;

    }


    async count(params = {}) {
        return _count(this, this.ctx.model.ContentTag, params);
    }

    async create(payload) {
        return _create(this, this.ctx.model.ContentTag, payload);
    }

    async removes(values, key = 'id') {
        return _removes(this, this.ctx.model.ContentTag, values, key);
    }

    async safeDelete(values) {
        return _safeDelete(this, this.ctx.model.ContentTag, values);
    }

    async update(id, payload) {
        return _update(this, this.ctx.model.ContentTag, id, payload);
    }

    async item(params = {}) {
        return _item(this, this.ctx.model.ContentTag, params)
    }

    async getHot(payload = {}) {
        let {
            pageSize
        } = payload;
        return this.ctx.model.ContentTag.findAll({
            limit: Number(pageSize) ? Number(pageSize) : 10,
            attributes: [
                'id',
                '_id',
                'name',
                'url',
                [this.app.Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM doracms_content_and_tag AS content_and_tag
                    WHERE
                    content_and_tag.tag_id = content_tag.id
                )`),
                    'count'
                ]
            ],
            order: this.app.Sequelize.literal('count DESC')
        })
    }


}

module.exports = ContentTagService;