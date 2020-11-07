/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-10-08 10:16:01
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
    _addToSet,
    _pull
} = require(path.join(process.cwd(), 'app/service/general'));


class UserService extends Service {

    async find(payload = {}, {
        query = {},
        searchKeys = [],
        include = [],
        attributes = null
    } = {}) {

        let listdata = _list(this, this.ctx.model.User, payload, {
            query: _.assign({
                state: '1'
            }, query),
            searchKeys: !_.isEmpty(searchKeys) ? searchKeys : ['userName', 'phoneNum', 'email'],
            include: concatPopulate([{
                    as: 'favorite',
                    attributes: ['title', 'stitle', '_id', 'id', 'sImg', 'url'],
                    model: 'Content'
                },
                // {
                //     as: 'message',
                //     attributes: ['title', 'stitle', '_id', 'id', 'sImg', 'url'],
                //     model: 'Content'
                // },
                {
                    as: 'despise',
                    attributes: ['title', 'stitle', '_id', 'id', 'sImg', 'url'],
                    model: 'Content'
                },
                {
                    as: 'praise',
                    attributes: ['title', 'stitle', '_id', 'id', 'sImg', 'url'],
                    model: 'Content'
                },
            ], include),
            attributes: attributes ? attributes : {
                exclude: ['password']
            },
        });
        return listdata;

    }

    async count(params = {}) {
        return _count(this, this.ctx.model.User, params);
    }

    async create(payload) {
        return _create(this, this.ctx.model.User, payload);
    }

    async removes(values, key = 'id') {
        return _removes(this, this.ctx.model.User, values, key);
    }

    async safeDelete(values) {
        return _safeDelete(this, this.ctx.model.User, values);
    }

    async update(id, payload) {
        return _update(this, this.ctx.model.User, id, payload);
    }

    async addToSet(res, id, payload) {
        return _addToSet(res, this.ctx.model.User, id, payload);
    }

    async pull(res, id, payload) {
        return _pull(res, this.ctx.model.User, id, payload);
    }

    async item({
        query = {},
        include = [],
        attributes = null
    } = {}) {
        return _item(this, this.ctx.model.User, {
            query: _.assign({
                state: '1'
            }, query),
            include: !_.isEmpty(include) ? include : [],
            attributes: attributes ? attributes : {
                exclude: ['password']
            },
        })
    }

}

module.exports = UserService;