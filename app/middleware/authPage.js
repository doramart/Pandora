/*
 * @Author: doramart
 * @Date: 2019-08-16 14:51:46
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-21 21:58:15
 */
'use strict';

module.exports = () => {
  return async function authPage(ctx, next) {
    if (ctx.session.logined) {
      await next();
    } else {
      ctx.redirect('/users/login');
    }
  };
};
