/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-10-25 18:27:42
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
    _safeDelete,
    _updateMany
} = require(path.join(process.cwd(), 'app/service/general'));


class ContentTemplateService extends Service {

    async find(payload, {
        query = {},
        searchKeys = [],
        include = [],
        attributes = null
    } = {}) {

        let listdata = _list(this, this.ctx.model.ContentTemplate, payload, {
            query: query,
            searchKeys: searchKeys,
            include: concatPopulate([{
                as: 'items',
                model: 'TemplateItems'
            }], include),
            attributes
        });
        return listdata;

    }


    async count(params = {}) {
        return _count(this, this.ctx.model.ContentTemplate, params);
    }

    async create(payload) {
        return _create(this, this.ctx.model.ContentTemplate, payload);
    }

    async removes(values, key = 'id') {
        return _removes(this, this.ctx.model.ContentTemplate, values, key);
    }

    async safeDelete(values) {
        return _safeDelete(this, this.ctx.model.ContentTemplate, values);
    }

    async update(id, payload) {
        return _update(this, this.ctx.model.ContentTemplate, id, payload);
    }

    async updateMany(ids, payload, query) {
        return _updateMany(this, this.ctx.model.ContentTemplate, ids, payload, query);
    }

    async item(params = {}) {
        return _item(this, this.ctx.model.ContentTemplate, params)
    }


}

module.exports = ContentTemplateService;