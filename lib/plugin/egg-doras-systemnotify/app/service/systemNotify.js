/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-10-03 10:30:49
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
    _updateMany
} = require(path.join(process.cwd(), 'app/service/general'));


class SystemNotifyService extends Service {

    async find(payload, {
        query = {},
        searchKeys = [],
        include = [],
        attributes = null
    } = {}) {

        let listdata = _list(this, this.ctx.model.SystemNotify, payload, {
            query: query,
            searchKeys: searchKeys,
            include: include,
            attributes
        });
        return listdata;

    }


    async count(params = {}) {
        return _count(this, this.ctx.model.SystemNotify, params);
    }

    async create(payload) {
        return _create(this, this.ctx.model.SystemNotify, payload);
    }

    async removes(values, key = 'id') {
        return _removes(this, this.ctx.model.SystemNotify, values, key);
    }

    async safeDelete(values) {
        return _safeDelete(this, this.ctx.model.SystemNotify, values);
    }

    async update(id, payload) {
        return _update(this, this.ctx.model.SystemNotify, id, payload);
    }

    async updateMany(ids, payload, params) {
        return _updateMany(this, this.ctx.model.SystemNotify, ids, payload, params);
    }

    async item(params = {}) {
        return _item(this, this.ctx.model.SystemNotify, params)
    }


}

module.exports = SystemNotifyService;