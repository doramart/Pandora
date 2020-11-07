const moment = require('moment');
module.exports = app => {
    const {
        DATE,
        STRING,
        TEXT,
        INTEGER,
        VIRTUAL
    } = app.Sequelize;
    const MailTemplate = app.model.define('mail_template', {
        id: {
            type: INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        _id: {
            type: VIRTUAL,
            get() {
                return this.id;
            },
            set(value) {
                throw new Error('not set!');
            }
        },
        comment: STRING, // 备注
        title: STRING, //标题 
        subTitle: STRING,
        content: TEXT('long'),
        temp_type: STRING,

        createdAt: {
            type: DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt: {
            type: DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        freezeTableName: true,
        tableName: 'doracms_mail_template',
        underscored: true,
    });

    MailTemplate.sync({
        force: false
    });

    return MailTemplate;
};
