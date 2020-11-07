/*
 * @Author: doramart 
 * @Date: 2019-11-02 18:38:55 
 * @Discription 404 filter
 * @Last Modified by: doramart
 * @Last Modified time: 2020-10-25 11:29:12
 */
const _ = require('lodash')
module.exports = (options, app) => {
    return async function notFoundHandler(ctx, next) {
        await next();
        if (ctx.status === 404 && !ctx.body) {
            if (ctx.acceptJSON) {
                ctx.body = {
                    error: 'Not Found'
                };
            } else {
                if (ctx.originalUrl.indexOf('/admin/') == 0) {
                    ctx.redirect('/dr-admin');
                } else {
                    try {
                        let defaultTemp = await ctx.helper.reqJsonData('contentTemplate/getDefaultTempInfo');
                        let siteInfo = await ctx.getSiteInfo();
                        let staticThemePath = app.config.static.prefix + '/themes/' + defaultTemp.alias;

                        if (!_.isEmpty(defaultTemp) && !_.isEmpty(siteInfo)) {
                            await ctx.render(`${defaultTemp.alias}/404`, {
                                themePublicPath: `../${defaultTemp.alias}/default.html`,
                                staticforder: defaultTemp.alias,
                                staticRootPath: app.config.static.prefix,
                                site: siteInfo,
                                staticThemePath,
                                ogData: {}
                            });
                        } else {
                            ctx.body = '<h1>Page Not Found</h1>';
                        }
                    } catch (error) {
                        ctx.body = '<h1>Page Not Found</h1>';
                    }
                }

            }
        }
    };
};