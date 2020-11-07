/**
 * Created by Administrator on 2015/4/15.
 * 内容管理对象
 */
const moment = require('moment');
module.exports = app => {
    const {
        DATE,
        STRING,
        BOOLEAN,
        INTEGER,
        TEXT,
        VIRTUAL
    } = app.Sequelize;
    const Content = app.model.define('content', {
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
        url: {
            type: VIRTUAL,
            get() {
                return `/details/${this.id}.html`;
            },
            set(value) {
                throw new Error('not set!');
            }
        },
        title: STRING,
        stitle: STRING,
        from: STRING,
        content_type: {
            type: STRING,
            defaultValue: '1' // 发布类型 1位普通，2为专题
        },
        // categories:INTEGER,
        sortPath: STRING, //存储所有父节点结构
        keywords: {
            type: STRING,
            allowNull: true,
            get() {
                let targetKeyWords = [];
                let currentKeywords = this.getDataValue('keywords');
                if (currentKeywords) {
                    if (currentKeywords.indexOf(',') >= 0) {
                        targetKeyWords = currentKeywords.split(',');
                    } else if (currentKeywords.indexOf('，') >= 0) {
                        targetKeyWords = currentKeywords.split('，');
                    }
                }
                return targetKeyWords;
            },
        },
        sImgType: {
            type: STRING,
            defaultValue: '2'
        }, // 首图类型 1：自动生成 2：本地上传
        cover: STRING, // 封面id
        videoImg: STRING(500), // 视频缩略图
        discription: STRING,
        appShowType: {
            type: STRING,
            defaultValue: '1'
        }, // app端排版格式 0 不显示图片 1小图 2大图 3视频
        imageArr: TEXT('long'), // 媒体集合（图片）
        videoArr: TEXT('long'), // 媒体集合（影片）
        duration: {
            type: STRING,
            defaultValue: '0:01'
        }, // 针对有视频的帖子时长
        author_id: INTEGER,
        state: {
            type: STRING,
            defaultValue: '0' // 0草稿 1待审核 2审核通过 3下架
        },
        draft: {
            type: STRING,
            defaultValue: '0' // 是否进入回收站 1:是  0:否
        },
        dismissReason: {
            type: STRING,
            defaultValue: '' // 驳回原因(针对审核不通过)
        },
        isTop: {
            type: INTEGER,
            allowNull: true,
            default: 0
        }, // 是否推荐，默认不推荐 0为不推荐，1为推荐
        roofPlacement: {
            type: STRING,
            default: '0'
        }, // 是否置顶，默认不置顶 0为不置顶，1为置顶
        clickNum: {
            type: INTEGER,
            default: 1
        },
        comments: TEXT('long'),
        simpleComments: {
            type: TEXT('long'),
            get() {
                const rawValue = this.getDataValue('simpleComments');
                return rawValue ? JSON.parse(rawValue) : null;
            }
        },
        markDownComments: TEXT('long'),
        sImg: STRING(500),
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
        tableName: 'doracms_content',
        underscored: true,
    });

    Content.associate = function () {

        app.model.Content.belongsToMany(app.model.ContentTag, {
            through: app.model.ContentAndTag,
            foreignKey: 'content_id',
            otherKey: 'tag_id',
            as: 'tags'
        });

        app.model.Content.belongsToMany(app.model.ContentCategory, {
            through: app.model.ContentAndCategory,
            foreignKey: 'content_id',
            otherKey: 'category_id',
            as: 'categories'
        });

        app.model.Content.belongsToMany(app.model.User, {
            through: app.model.UserFavoriteContent,
            foreignKey: 'content_id',
            otherKey: 'user_id',
            as: 'favorite'
        });

        // app.model.Content.belongsToMany(app.model.User, {
        //     through: app.model.UserMessageContent,
        //     foreignKey: 'content_id',
        //     otherKey: 'user_id',
        //     as: 'message'
        // });

        app.model.Content.belongsToMany(app.model.User, {
            through: app.model.UserDespiseContent,
            foreignKey: 'content_id',
            otherKey: 'user_id',
            as: 'despise'
        });

        app.model.Content.belongsToMany(app.model.User, {
            through: app.model.UserPraiseContent,
            foreignKey: 'content_id',
            otherKey: 'user_id',
            as: 'praise'
        });

        app.model.Content.belongsTo(app.model.User, {
            foreignKey: 'author_id',
            as: 'uAuthor'
        });

    }

    Content.sync({
        force: false
    });

    return Content;
};