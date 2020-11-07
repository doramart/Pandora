/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-09-05 13:35:07
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
    _updateMany,
    _removes,
    _safeDelete
} = require(path.join(process.cwd(), 'app/service/general'));


class ContentCategoryService extends Service {

    async find(payload, {
        query = {},
        searchKeys = [],
        include = [],
        attributes = null
    } = {}) {

        let listdata = _list(this, this.ctx.model.ContentCategory, payload, {
            query: query,
            searchKeys: searchKeys,
            include: include,
            attributes,
            sort: [
                ['sort_id', 'asc']
            ]
        });
        return listdata;

    }


    async count(params = {}) {
        return _count(this, this.ctx.model.ContentCategory, params);
    }

    async create(payload) {
        return _create(this, this.ctx.model.ContentCategory, payload);
    }

    async removes(values, key = 'id') {
        return _removes(this, this.ctx.model.ContentCategory, values, key);
    }

    async safeDelete(values) {
        return _safeDelete(this, this.ctx.model.ContentCategory, values);
    }

    async update(id, payload) {
        return _update(this, this.ctx.model.ContentCategory, id, payload);
    }

    async updateMany(ids, payload, params) {
        return _updateMany(this, this.ctx.model.ContentCategory, ids, payload, params);
    }

    async item({
        query = {},
        include = [],
        attributes = null
    } = {}) {
        return _item(this, this.ctx.model.ContentCategory, {
            attributes: attributes,
            query: query,
            include: !_.isEmpty(include) ? include : [{
                as: 'contentTemp',
                model: "TemplateItems"
            }]
        })
    }


}

module.exports = ContentCategoryService;