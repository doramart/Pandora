/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-10-01 23:53:05
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

class ContentAndTagService extends Service {

    async find(payload, {
        sort = [],
        query = {},
        searchKeys = [],
        include = [],
        attributes = null
    } = {}) {

        let listdata = _list(this, this.ctx.model.ContentAndTag, payload, {
            attributes: attributes,
            query: query,
            searchKeys: searchKeys,
            include: !_.isEmpty(include) ? include : [],
            sort: sort
        });

        return listdata;

    }


    async count(params = {}) {
        return _count(this, this.ctx.model.ContentAndTag, params);
    }

    async create(payload) {
        return _create(this, this.ctx.model.ContentAndTag, payload);
    }

    async removes(values, key = 'id') {
        return _removes(this, this.ctx.model.ContentAndTag, values, key);
    }

    async safeDelete(values, updateObj = {}) {
        return _safeDelete(this, this.ctx.model.ContentAndTag, values, updateObj);
    }

    async update(id, payload) {
        return _update(this, this.ctx.model.ContentAndTag, id, payload);
    }

    async inc(id, payload) {
        return _inc(this, this.ctx.model.ContentAndTag, id, payload);
    }

    async updateMany(ids, payload) {
        return _updateMany(this, this.ctx.model.ContentAndTag, ids, payload);
    }

    async item({
        query = {},
        include = [],
        attributes = null
    } = {}) {
        return _item(this, this.ctx.model.ContentAndTag, {
            attributes: attributes,
            query: query,
            include: !_.isEmpty(include) ? include : [],

        })
    }


}

module.exports = ContentAndTagService;