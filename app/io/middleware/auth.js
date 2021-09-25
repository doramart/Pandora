/*
 * @Author: doramart
 * @Description: socket.io auth
 * @Date: 2021-03-20 13:25:25
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-21 22:03:33
 */
'use strict';
module.exports = (app) => {
  return async (ctx, next) => {
    // connect
    if (!ctx.session.adminUserInfo) return;
    const socket_key = `${app.config.socket_prefix}:${ctx.session.adminUserInfo.id}`;
    const MAX_TTL = 1000 * 60 * 60 * 24; // 最大过期时长，兜底用
    if (ctx.socket.id) {
      ctx.helper.setMemoryCache(socket_key, ctx.socket.id, MAX_TTL);
    }

    await next();

    // disconnect
    ctx.helper.setMemoryCache(socket_key, '');
  };
};
