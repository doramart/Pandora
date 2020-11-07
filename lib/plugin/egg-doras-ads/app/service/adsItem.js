/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-08-31 00:10:34
 */

'use strict';
const Service = require('egg').Service;
const path = require('path')

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


class AdsItemService extends Service {

    async find(payload, {
        query = {},
        searchKeys = [],
        include = [],
        attributes = null
    } = {}) {

        let listdata = _list(this, this.ctx.model.AdsItems, payload, {
            query: query,
            searchKeys: searchKeys,
            include: include,
            attributes
        });
        return listdata;

    }


    async count(params = {}) {
        return _count(this, this.ctx.model.AdsItems, params);
    }

    async create(payload) {
        return _create(this, this.ctx.model.AdsItems, payload);
    }

    async removes(values, key = 'id') {
        return _removes(this, this.ctx.model.AdsItems, values, key);
    }

    async safeDelete(values) {
        return _safeDelete(this, this.ctx.model.AdsItems, values);
    }

    async update(id, payload) {
        return _update(this, this.ctx.model.AdsItems, id, payload);
    }

    async item(params = {}) {
        return _item(this, this.ctx.model.AdsItems, params)
    }


}

module.exports = AdsItemService;