/*
 * @Author: doramart 
 * @Date: 2019-06-21 11:14:02 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-10-25 18:21:54
 */

const _ = require('lodash');

// 关键操作记录日志
const _addActionUserInfo = (ctx, params = {}) => {

    let infoStr = '';

    if (!_.isEmpty(ctx.session.adminUserInfo)) {
        infoStr += 'actionUser: ' + JSON.stringify(ctx.session.adminUserInfo) + ',';
    }

    if (!_.isEmpty(params)) {
        infoStr += 'actionParams: ' + JSON.stringify(params) + ',';
    }

    return infoStr;
}

const _renderinclude = (ctx, baseSql, include) => {
    if (include && include != 'none') {
        baseSql.include = [];
        for (const popItem of include) {
            let includeItem = {};
            if (typeof popItem === 'object') {
                if (popItem.model && ctx.model[popItem.model]) {
                    includeItem = popItem;
                    includeItem.model = ctx.model[popItem.model];
                    // popItem.path && (includeItem.as = popItem.path);
                    // popItem.select && (includeItem.attributes = (popItem.select).split(/[ ]+/));
                    // popItem.where && (includeItem.where = popItem.where);
                }
            } else {
                popItem && (includeItem.model = ctx.model[popItem])
            }
            if (!_.isEmpty(includeItem)) {
                baseSql.include.push(includeItem);
            }
        }
    }
    return baseSql;
}

/**
 * 通用列表
 * @method list
 * @param  {[type]} req     [description]
 * @param  {[type]} res     [description]
 * @param  {[type]} Model [description]
 * @param  {[type]} sort    排序
 * @return {[type]}         [description]
 */


exports._list = async ({
    ctx,
    app
}, Model, payload, {
    sort = [],
    attributes = null,
    query = {},
    searchKeys = [],
    searchParams = {},
    include = []
} = {}) => {


    let {
        current,
        pageSize,
        searchkey,
        isPaging,
        skip,
        lean
    } = payload;

    let documents;
    let count = 0;
    query = query || {};
    current = current || 1, pageSize = Number(pageSize) || 10;
    isPaging = isPaging == '0' ? false : true;
    lean = lean == '1' ? true : false;
    let skipNum = skip ? skip : ((Number(current)) - 1) * Number(pageSize);
    let sortObj = !_.isEmpty(sort) ? sort : [
        ['created_at', 'desc']
    ];

    // console.log('-----sortObj----', sortObj)

    if (searchkey) {
        if (searchKeys) {
            if (typeof searchKeys == 'object' && searchKeys.length > 0) {
                let searchStr = [];
                for (let i = 0; i < searchKeys.length; i++) {
                    const keyItem = searchKeys[i];
                    searchStr.push({
                        [keyItem]: {
                            [app.Sequelize.Op.like]: `%${searchkey}%`
                        }
                    })
                }
                query[app.Sequelize.Op.or] = searchStr;
            } else {
                query[searchKeys] = {
                    [app.Sequelize.Op.like]: `%${searchkey}%`
                }
            }
        }
    }

    let baseSql = {
        distinct: true,
        where: query,
        offset: skipNum,
        order: sortObj
    };

    if (attributes) {
        baseSql.attributes = attributes;
    }

    if (!_.isEmpty(include) && include != 'none') {
        baseSql = _renderinclude(ctx, baseSql, include);
    }

    if (isPaging) {
        baseSql.limit = Number(pageSize);
    } else {
        if (payload.pageSize > 0) {
            baseSql.limit = Number(pageSize);
        }
    }

    if (lean) {
        baseSql.raw = true;
    }

    documents = await Model.findAndCountAll(baseSql)
    count = documents.count;

    // console.log('--count--', count)

    if (isPaging) {

        let pageInfoParams = {
            totalItems: count,
            pageSize: Number(pageSize),
            current: Number(current),
            searchkey: searchkey || '',
            totalPage: Math.ceil(count / Number(pageSize)),

        };
        for (const querykey in searchParams) {
            if (searchParams.hasOwnProperty(querykey)) {
                const queryValue = searchParams[querykey];
                if (typeof queryValue != 'object') {
                    _.assign(pageInfoParams, {
                        [querykey]: queryValue || ''
                    });
                }
            }
        }

        return {

            docs: documents.rows,
            pageInfo: pageInfoParams

        }
    } else {
        return documents.rows;
    }

}


exports._count = async ({
    ctx,
    app
}, Model, query = {}) => {
    return await Model.count({
        where: query
    });
}

exports._create = async ({
    ctx,
    app
}, Model, payload) => {
    payload.id = 0;
    return await Model.create(payload);
}

/**
 * 通用单个
 * @method item
 * @param  {[type]} res [description]
 * @param  {[type]} Model [description]
 * @return {[type]}         [description]
 */

exports._item = async ({
    ctx,
    app
}, Model, {
    attributes = null,
    query = {},
    include = []
} = {}) => {

    let baseSql = {
        where: query,
    }

    if (attributes) {
        baseSql.attributes = attributes;
    }

    if (include && include != 'none') {
        baseSql = _renderinclude(ctx, baseSql, include);
    }

    return await Model.findOne(baseSql);

}

/**
 * 通用删除
 * @method deletes
 * @param  {[type]}   Model [description]
 * @param  {[type]}   ids [description]
 */

exports._removes = async ({
    ctx,
    app
}, Model, ids, key) => {

    if (!checkCurrentId(ids)) {
        throw new Error(ctx.__("validate_error_params"));
    } else {
        ids = ids.toString().split(',');
    }

    ctx.logger.warn(_addActionUserInfo(ctx, {
        ids,
        key
    }));

    return await Model.destroy({
        where: {
            [key]: {
                [app.Sequelize.Op.in]: ids
            }
        }
    })

}

/**
 * 通用删除
 * @method deletes
 * @param  {[type]}   Model [description]
 */

exports._removeAll = async ({
    ctx,
    app
}, Model) => {

    return await Model.destroy({
        where: {},
        truncate: true
    })

}

/**
 * 通用删除
 * @method deletes
 * @param  {[type]}   Model [description]
 * @param  {[type]}   ids [description]
 */

exports._safeDelete = async ({
    ctx,
    app
}, Model, ids, updateObj = {}) => {

    if (!checkCurrentId(ids)) {
        throw new Error(ctx.__("validate_error_params"));
    } else {
        ids = ids.split(',');
    }

    let queryObj = {
        state: '0'
    };

    if (!_.isEmpty(updateObj)) {
        queryObj = updateObj;
    }

    return await Model.update(queryObj, {
        where: {
            id: {
                [app.Sequelize.Op.in]: ids
            }
        }
    })

}

/**
 * 通用编辑
 * @method update
 * @param  {[type]} Model [description]
 * @param  {[type]} id     [description]
 * @param  {[type]} data    [description]
 */

exports._update = async ({
    ctx,
    app
}, Model, id, data, query = {}) => {

    if (typeof id === 'number') {
        query = _.assign({}, query, {
            id: id
        });
    } else {
        if (_.isEmpty(query)) {
            throw new Error(ctx.__('validate_error_params'));
        }
    }

    const user = await this._item({
        ctx,
        app
    }, Model, {
        query: query
    })

    if (_.isEmpty(user)) {
        throw new Error(ctx.__('validate_error_params'));
    }

    return await Model.update(data, {
        where: query
    });

}

/**
 * 通用编辑
 * @method update
 * @param  {[type]} Model [description]
 * @param  {[type]} ids     [description]
 * @param  {[type]} data    [description]
 */

exports._updateMany = async ({
    ctx,
    app
}, Model, ids = '', data, query = {}) => {

    if (_.isEmpty(ids) && _.isEmpty(query)) {
        throw new Error(ctx.__('validate_error_params'));
    }

    if (!_.isEmpty(ids)) {
        if (!checkCurrentId(ids)) {
            throw new Error(ctx.__("validate_error_params"));
        } else {
            ids = ids.split(',');
        }
        query = _.assign({}, query, {
            id: {
                [app.Sequelize.Op.in]: ids
            }
        });
    }

    return await Model.update(data, {
        where: query
    });

}

/**
 * 通用数组字段添加
 * @method update
 * @param  {[type]} Model [description]
 * @param  {[type]} id     [description]
 * @param  {[type]} data    [description]
 */

exports._addToSet = async (ctx, Model, id, data, query = {}) => {

    if (_.isEmpty(id) && _.isEmpty(query)) {
        throw new Error(ctx.__('validate_error_params'));
    }

    if (!_.isEmpty(id)) {
        query = _.assign({}, query, {
            id: id
        });
    }

    return await Model.update(query, {
        $addToSet: data
    });

}


/**
 * 通用数组字段删除
 * @method update
 * @param  {[type]} Model [description]
 * @param  {[type]} id     [description]
 * @param  {[type]} data    [description]
 */

exports._pull = async ({
    ctx,
    app
}, Model, id, data, query = {}) => {

    if (_.isEmpty(id) && _.isEmpty(query)) {
        throw new Error(ctx.__('validate_error_params'));
    }

    if (!_.isEmpty(id)) {
        query = _.assign({}, query, {
            id: id
        });
    }

    return await Model.update(query, {
        $pull: data
    });

}

/**
 * 通用属性加值
 * @method update
 * @param  {[type]} Model [description]
 * @param  {[type]} id     [description]
 * @param  {[type]} data    [description]
 */

exports._inc = async ({
    ctx,
    app
}, Model, id, data, {
    query = {}
} = {}) => {

    if (_.isEmpty(id) && _.isEmpty(query)) {
        throw new Error(ctx.__('validate_error_params'));
    }

    if (!_.isEmpty(id)) {
        query = _.assign({}, {
            id: id
        }, query);
    }

    Model.findOne({
        where: query
    }).then(function (item) {
        for (const attr in data) {
            if (data.hasOwnProperty(attr)) {
                const attrValue = data[attr];
                !_.isEmpty(item) && item.increment([attr], {
                    by: Number(attrValue)
                }).then(function (item) {
                    console.log('success');
                })
            }
        }
    })
}