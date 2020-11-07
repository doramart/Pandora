'use strict'

const moment = require('moment');
module.exports = app => {
  const {
    DATE,
    STRING,
    BOOLEAN,
    INTEGER,
    BIGINT
  } = app.Sequelize;
  const CryptoJS = require("crypto-js");

  const User = app.model.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    _id: {
      type: INTEGER,
      get() {
        return this.id;
      },
      set(value) {
        throw new Error('not set!');
      }
    },
    enable: {
      type: BOOLEAN,
      defaultValue: true
    },
    name: STRING,
    userName: STRING,
    password: {
      type: STRING(100),
      set(value) {
        this.setDataValue('password', CryptoJS.AES.encrypt(value, app.config.encrypt_key).toString());
      }
    },
    email: STRING,
    qq: INTEGER,
    phoneNum: STRING,
    countryCode: STRING,
    idNo: INTEGER,
    idType: {
      type: STRING,
      defaultValue: '1'
    },
    comments: {
      type: STRING,
      defaultValue: ''
    },
    introduction: {
      type: STRING,
      defaultValue: ''
    },
    position: STRING,
    profession: STRING,
    industry: STRING,
    experience: STRING,
    company: STRING,
    website: STRING,
    logo: {
      type: STRING(500),
      defaultValue: '/static/upload/images/defaultlogo.png'
    },
    group: {
      type: STRING,
      defaultValue: '0'
    },
    province: STRING,
    city: STRING,
    gender: {
      type: STRING,
      defaultValue: '0' // 性别 0男 1女
    },
    state: {
      type: STRING,
      defaultValue: '1' // 1正常，0删除
    },
    retrieve_time: {
      type: BIGINT,
      allowNull: true
    },
    loginActive: {
      type: BOOLEAN,
      defaultValue: false
    },
    deviceId: STRING
  }, {
    freezeTableName: true,
    tableName: 'doracms_user',
    underscored: true,
  });

  User.associate = function () {

    app.model.User.belongsToMany(app.model.Content, {
      through: app.model.UserPraiseContent,
      foreignKey: 'user_id',
      otherKey: 'content_id',
      as: 'praise'
    });

    app.model.User.belongsToMany(app.model.Content, {
      through: app.model.UserFavoriteContent,
      foreignKey: 'user_id',
      otherKey: 'content_id',
      as: 'favorite'
    });

    // app.model.User.belongsToMany(app.model.Content, {
    //   through: app.model.UserMessageContent,
    //   foreignKey: 'user_id',
    //   otherKey: 'content_id',
    //   as: 'message'
    // });

    app.model.User.belongsToMany(app.model.Content, {
      through: app.model.UserDespiseContent,
      foreignKey: 'user_id',
      otherKey: 'content_id',
      as: 'despise'
    });
  
  }

  User.sync({
    force: false
  });

  return User;
};