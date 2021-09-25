/*
 * @Author: doramart
 * @Date: 2019-06-24 13:20:49
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-22 22:34:49
 */

'use strict';
const Service = require('egg').Service;

const {
  _list,
  _item,
  _count,
  _create,
  _update,
  _removes,
  _safeDelete,
} = require('./general');

class SystemConfigService extends Service {
  async find(
    payload,
    { query = {}, searchKeys = [], include = [], attributes = null } = {}
  ) {
    const listdata = _list(this, this.ctx.model.SystemConfig, payload, {
      query,
      searchKeys,
      include,
      attributes,
    });
    return listdata;
  }

  async count(params = {}) {
    return _count(this, this.ctx.model.SystemConfig, params);
  }

  async create(payload) {
    return _create(this, this.ctx.model.SystemConfig, payload);
  }

  async removes(values, key = 'id') {
    return _removes(this, this.ctx.model.SystemConfig, values, key);
  }

  async safeDelete(values) {
    return _safeDelete(this, this.ctx.model.SystemConfig, values);
  }

  async update(id, payload) {
    return _update(this, this.ctx.model.SystemConfig, id, payload);
  }

  async item(params = {}) {
    return _item(this, this.ctx.model.SystemConfig, params);
  }
}

module.exports = SystemConfigService;
