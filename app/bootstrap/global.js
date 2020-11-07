/*
 * @Author: doramart 
 * @Date: 2019-06-18 17:04:40 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-10-04 22:45:39
 */

const _ = require('lodash');
const moment = require('moment');

// 校验合法ID
global.checkCurrentId = (ids) => {
  if (!ids) return false;
  let idState = true;
  let idsArr = ids.toString().split(',');
  if (typeof idsArr === "object" && idsArr.length > 0) {
    for (let i = 0; i < idsArr.length; i++) {
      if (isNaN(Number(idsArr[i]))) {
        idState = false;
        break;
      }
    }
  } else {
    idState = false;
  }
  return idState;
}


global.getStrLength = (str) => {
  let charCode = -1;
  const len = str.length;
  let realLength = 0;
  let zhChar = 0,
    enChar = 0;
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
      enChar++
    } else {
      realLength += 2;
      zhChar++
    }
  }
  return {
    length: realLength,
    enChar,
    zhChar
  }
}


global.getDateStr = (addDayCount) => {
  var dd = new Date();
  dd.setDate(dd.getDate() + addDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
  let endDate = moment().format("YYYY-MM-DD");
  return {
    startTime: y + "-" + m + "-" + d + ' 23:59:59',
    endTime: endDate + ' 23:59:59'
  }
}


global.getAuthUserFields = (type = '') => {
  let fieldStr = ["id", "userName", "group", "logo", "enable", "state"];
  if (type == 'login') {
    fieldStr = ["id", "userName", "group", "logo", "enable", "state", "phoneNum", "countryCode", "email", "comments", "position", "loginActive", "password"];
  } else if (type == 'base') {
    fieldStr = ["id", "userName", "group", "logo", "date", "enable", "state", "phoneNum", "countryCode", "email", "comments", "comments", "profession", "experience", "industry", "introduction", "creativeRight", "gender"];
  } else if (type == 'session') {
    fieldStr = ["id", "userName", "name", "group", "logo", "enable", "state", "phoneNum", "countryCode", "email", "comments", "position", "gender"];
  }
  return fieldStr;
}


global.getContentListFields = (type = '') => {

  let files = null;
  if (type == 'normal') {
    files = ['id', 'title', 'stitle', 'sImg', 'discription', 'clickNum', 'roofPlacement', 'content_type', 'videoImg', 'state', 'dismissReason', 'isTop']
  } else if (type == 'simple') {
    files = ['id', 'title', 'stitle', 'sImg', 'stitle', 'clickNum', 'roofPlacement', 'content_type', 'videoImg', 'state', 'dismissReason'];
  } else if (type == 'stage1') {
    files = ['id', 'title', 'stitle', 'sImg', 'discription', 'comments', 'clickNum', 'roofPlacement', 'content_type', 'videoImg', 'state', 'dismissReason', 'isTop']
  } else {
    files = ['id', 'title', 'stitle', 'sImg', 'discription', 'clickNum', 'roofPlacement', 'content_type', 'appShowType', 'imageArr', 'videoArr', 'duration', 'simpleComments', 'comments', 'videoImg', 'state', 'dismissReason', 'isTop']
  }
  // console.log('--files----', files)
  files.push('createdAt');
  files.push('updatedAt');
  return files;
}

global.concatPopulate = (defaultPopulate, inPopulate) => {

  let newPopulate = _.differenceBy(defaultPopulate, inPopulate, 'as');
  return newPopulate.concat(inPopulate);

}