const moment = require('moment');
const fs = require("fs");
const _ = require('lodash');
const child = require('child_process');

module.exports = app => {

    return {
        schedule: {
            cron: app.config.backUpTick,
            type: 'all', // 指定所有的 worker 都需要执行
        },
        async task(ctx) {

            let date = new Date();
            let ms = moment(date).format('YYYYMMDDHHmmss').toString();

            let databackforder = app.config.sqlPath.backu;
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

                        console.log('back up data success');
                    } catch (error) {
                        console.log('back up data error', error);
                    }

                }


            }


        },
    }
};