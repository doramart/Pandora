/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-10-01 23:12:15
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

class MessageService extends Service {

    async find(payload, {
        query = {},
        searchKeys = [],
        include = [],
        attributes = null
    } = {}) {

        let listdata = _list(this, this.ctx.model.Message, payload, {
            query: query,
            searchKeys: searchKeys,
            include: concatPopulate([{
                as: 'contentId',
                attributes: ['title', 'stitle', '_id', 'id', 'url'],
                model: 'Content'
            }, {
                as: 'author',
                attributes: ['userName', '_id', 'id', 'enable', 'createdAt', 'logo'],
                model: 'User'
            }, {
                as: 'replyAuthor',
                attributes: ['userName', '_id', 'id', 'enable', 'createdAt', 'logo'],
                model: 'User'
            }, {
                as: 'adminAuthor',
                attributes: ['userName', '_id', 'id', 'enable', 'createdAt', 'logo'],
                model: 'AdminUser'
            }, {
                as: 'adminReplyAuthor',
                attributes: ['userName', '_id', 'id', 'enable', 'createdAt', 'logo'],
                model: 'AdminUser'
            }], include),
            attributes
        });
        return listdata;

    }


    async count(params = {}) {
        return _count(this, this.ctx.model.Message, params);
    }

    async create(payload) {
        return _create(this, this.ctx.model.Message, payload);
    }

    async removes(values, key = 'id') {
        return _removes(this, this.ctx.model.Message, values, key);
    }

    async safeDelete(values) {
        return _safeDelete(this, this.ctx.model.Message, values);
    }

    async update(id, payload) {
        return _update(this, this.ctx.model.Message, id, payload);
    }

    async item({
        query = {},
        include = [],
        attributes = null
    } = {}) {
        return _item(this, this.ctx.model.Message, {
            query: query,
            include: concatPopulate([{
                as: 'contentId',
                attributes: ['title', 'stitle', '_id', 'id', 'url'],
                model: 'Content'
            }, {
                as: 'author',
                attributes: ['userName', '_id', 'id', 'enable', 'createdAt', 'logo'],
                model: 'User'
            }, {
                as: 'replyAuthor',
                attributes: ['userName', '_id', 'id', 'enable', 'createdAt', 'logo'],
                model: 'User'
            }, {
                as: 'adminAuthor',
                attributes: ['userName', '_id', 'id', 'enable', 'createdAt', 'logo'],
                model: 'AdminUser'
            }, {
                as: 'adminReplyAuthor',
                attributes: ['userName', '_id', 'id', 'enable', 'createdAt', 'logo'],
                model: 'AdminUser'
            }], include),
            attributes
        })
    }


}

module.exports = MessageService;