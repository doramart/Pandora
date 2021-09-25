/*
 * @Author: doramart
 * @Date: 2019-06-24 13:20:49
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-22 22:34:13
 */

'use strict';
const Service = require('egg').Service;

// general是一个公共库，可用可不用
const {
  _list,
  _item,
  _count,
  _create,
  _update,
  _removes,
  _removeAll,
} = require('./general');

class HookService extends Service {
  async find(
    payload,
    { query = {}, searchKeys = [], include = [], attributes = null } = {}
  ) {
    const listdata = _list(this, this.ctx.model.Hook, payload, {
      query,
      searchKeys,
      include,
      attributes,
    });
    return listdata;
  }

  async count(params = {}) {
    return _count(this, this.ctx.model.Hook, params);
  }

  async create(payload) {
    return _create(this, this.ctx.model.Hook, payload);
  }

  async removes(values, key = 'id') {
    return _removes(this, this.ctx.model.Hook, values, key);
  }

  async removeAll() {
    return _removeAll(this, this.ctx.model.Hook);
  }

  async update(id, payload) {
    return _update(this, this.ctx.model.Hook, id, payload);
  }

  async item(params = {}) {
    return _item(this, this.ctx.model.Hook, params);
  }
}

module.exports = HookService;
