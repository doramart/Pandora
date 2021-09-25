/*
 * @Author: doramart
 * @Date: 2019-06-24 13:20:49
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-22 23:39:48
 */

'use strict';
const Service = require('egg').Service;

const _ = require('lodash');
const {
  _list,
  _item,
  _count,
  _create,
  _update,
  _removes,
  _safeDelete,
} = require('./general');

class AdminUserService extends Service {
  async find(
    payload,
    { query = {}, searchKeys = [], include = [], attributes = null } = {}
  ) {
    const listdata = _list(this, this.ctx.model.AdminUser, payload, {
      query,
      searchKeys,
      include,
      attributes,
    });
    return listdata;
  }

  async count(params = {}) {
    return _count(this, this.ctx.model.AdminUser, params);
  }

  async create(payload) {
    return _create(this, this.ctx.model.AdminUser, payload);
  }

  async removes(values, key = 'id') {
    return _removes(this, this.ctx.model.AdminUser, values, key);
  }

  async safeDelete(values) {
    return _safeDelete(this, this.ctx.model.AdminUser, values);
  }

  async update(id, payload) {
    return _update(this, this.ctx.model.AdminUser, id, payload);
  }

  async item({ query = {}, include = [], attributes = null } = {}) {
    return _item(this, this.ctx.model.AdminUser, {
      attributes: attributes ? attributes : { exclude: ['password', 'email'] },
      query,
      include: !_.isEmpty(include)
        ? include
        : [
            {
              as: 'group',
              attributes: ['power', 'id', 'name'],
              model: 'AdminGroup',
            },
            {
              as: 'targetEditor',
              attributes: ['id', '_id', 'userName'],
              model: 'User',
            },
          ],
    });
  }
}

module.exports = AdminUserService;
