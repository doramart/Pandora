/*
 * @Author: doramart
 * @Date: 2019-08-16 14:51:46
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-21 21:57:35
 */
'use strict';
module.exports = () => {
  return async function authApiToken(ctx, next) {
    if (ctx.session.logined) {
      await next();
    } else {
      ctx.helper.renderFail(ctx, {
        message: ctx.__('label_notice_asklogin'),
      });
    }
  };
};
