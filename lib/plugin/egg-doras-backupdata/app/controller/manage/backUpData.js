const moment = require('moment');
const isDev = process.env.NODE_ENV == 'development' ? true : false;
const fs = require("fs");
const _ = require('lodash');
const child = require('child_process');
let BackUpDataController = {

    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let backUpDataList = await ctx.service.backUpData.find(payload, {
                attributes: {
                    exclude: ['path']
                }
            });

            ctx.helper.renderSuccess(ctx, {
                data: backUpDataList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },


    async backUpData(ctx, app) {

        let ms = moment(new Date()).format('YYYYMMDDHHmmss').toString();

        let databackforder = app.config.sqlPath.backup;
        let dataPath = databackforder + ms;
        let sqlInfo = app.config.sequelize;

        if (!_.isEmpty(sqlInfo)) {
            let {
                username,
                password,
                database,
                host,
                port
            } = sqlInfo;

            let cmdstr = `${app.config.sqlPath.bin}mysqldump -u${username} -h${host} -P${port} --databases ${database} --lock-all-tables --flush-logs -p${password} > ${dataPath}/${database}.sql`
            if (!fs.existsSync(databackforder)) {
                fs.mkdirSync(databackforder);
            }
            if (fs.existsSync(dataPath)) {
                console.log('已经创建过备份了');
            } else {
                fs.mkdirSync(dataPath);

                try {
                    child.execSync(cmdstr);
                    // 操作记录入库
                    let optParams = {
                        logs: "Data backup",
                        path: dataPath,
                        fileName: `${ms}/${database}.sql`
                    }
                    await ctx.service.backUpData.create(optParams);
                    ctx.helper.renderSuccess(ctx);
                } catch (error) {
                    ctx.helper.renderFail(ctx, {
                        message: error
                    });
                }

            }
        }


    },

    async removes(ctx, app) {

        try {
            let targetIds = ctx.query.ids;

            let currentItem = await ctx.service.backUpData.item({
                query: {
                    id: targetIds
                }
            });
            if (currentItem && currentItem.path) {
                await ctx.helper.deleteFolder(currentItem.path);
            } else {
                throw new Error(ctx.__('validate_error_params'));
            }

            await ctx.service.backUpData.removes(targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }

}



module.exports = BackUpDataController;