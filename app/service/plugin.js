/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-08-14 20:22:03
 */

'use strict';
const Service = require('egg').Service;


const _ = require('lodash')

const {
    _list,
    _item,
    _count,
    _create,
    _update,
    _removes,
    _safeDelete
} = require('./general');


class PluginService extends Service {

    async find(payload, {
        query = {},
        searchKeys = [],
        include = [],
        attributes = null
    } = {}) {

        let listdata = _list(this, this.ctx.model.Plugin, payload, {
            query: query,
            searchKeys: searchKeys,
            include: include,
            attributes
        });
        return listdata;

    }


    async count(params = {}) {
        return _count(this, this.ctx.model.Plugin, params);
    }

    async create(payload) {
        return _create(this, this.ctx.model.Plugin, payload);
    }

    async removes(values, key = 'id') {
        return _removes(this, this.ctx.model.Plugin, values, key);
    }

    async safeDelete(values) {
        return _safeDelete(this, this.ctx.model.Plugin, values);
    }

    async update(id, payload) {
        return _update(this, this.ctx.model.Plugin, id, payload);
    }

    async item(params = {}) {
        return _item(this, this.ctx.model.Plugin, params)
    }


}

module.exports = PluginService;