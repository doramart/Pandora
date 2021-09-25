'use strict';
const fs = require('fs');

const qiniu = require('qiniu');

const scanforder = (path) => {
  const folderList = [];
  const files = fs.readdirSync(path);
  files.forEach(function (item) {
    const tmpPath = path + '/' + item,
      stats = fs.statSync(tmpPath);
    if (stats.isDirectory()) {
      folderList.push(item);
    }
  });
  return folderList;
};

const scanFiles = (basePath, path) => {
  // 记录原始路径
  const filesList = [];
  // let basePath = path;
  const fileList = [],
    folderList = [],
    walk = function (path, fileList, folderList) {
      const files = fs.readdirSync(path);
      files.forEach(function (item) {
        const tmpPath = path + '/' + item,
          stats = fs.statSync(tmpPath);
        if (stats.isDirectory()) {
          walk(tmpPath, fileList, folderList);
        } else {
          const currentPath = tmpPath.replace(basePath + '/dist/', '');
          filesList.push({
            localFile: tmpPath,
            pathKey: currentPath,
          });
        }
      });
    };

  walk(path, fileList, folderList);

  return filesList;
};

const uploadByQiniu = (localFile, targetKey) => {
  return new Promise((resolve, reject) => {
    const config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z0;

    config.useHttpsDomain = true;

    // 要上传的空间
    const bucket = 'cmsupload';

    const accessKey = 'V6tL3A9-bg6eJ8BPA62Xpq20GGKYgK7-2uk6MgF5';
    const secretKey = '17yL6dNxnC2-dSLJOONeBRjonoCDCrSQZoJeRC81';
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: bucket + ':' + targetKey,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);

    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    // console.log('localFile: ', localFile);
    // console.log('targetKey: ', targetKey);
    // 文件上传
    setTimeout(() => {
      formUploader.putFile(
        uploadToken,
        targetKey,
        localFile,
        putExtra,
        function (respErr, respBody, respInfo) {
          if (respErr) {
            // throw respErr;
            reject(respErr);
          }
          if (respInfo.statusCode === 200) {
            console.log(respBody);
            resolve();
          } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
            resolve();
          }
        }
      );
    }, 1000);
  });
};

module.exports = {
  scanforder,
  scanFiles,
  uploadByQiniu,
};
