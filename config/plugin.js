'use strict';
const path = require('path');

const pluginConfigs = require('./ext/plugin')
// add you build-in plugin here, example:
exports.nunjucks = {
    enable: true,
    package: 'egg-view-nunjucks',
};


exports.sequelize = {
    enable: true,
    package: 'egg-sequelize',
};

exports.session = true;

exports.doraBackUpData = {
    enable: true,
    package: 'egg-doras-backupdata',
    path: path.join(__dirname, "../lib/plugin/egg-doras-backupdata")
};

exports.validate = {
    enable: true,
    package: 'egg-doras-validate',

};

exports.doraUploadFile = {
    enable: true,
    package: 'egg-doras-uploadfile',

};


// 

// // PLUGIN_NORMALPLUGIN_BEGIN

// doraRegUserPluginBegin
exports.doraRegUser = {
    enable: true,
    package: 'egg-doras-reguser',
    path: path.join(__dirname, "../lib/plugin/egg-doras-reguser")
};
// doraRegUserPluginEnd

// doraAdsPluginBegin
exports.doraAds = {
    enable: true,
    package: 'egg-doras-ads',
    path: path.join(__dirname, "../lib/plugin/egg-doras-ads")
};
// doraAdsPluginEnd

// doraAnnouncePluginBegin
exports.doraAnnounce = {
    enable: true,
    package: 'egg-doras-announce',
    path: path.join(__dirname, "../lib/plugin/egg-doras-announce")
};
// doraAnnouncePluginEnd


// doraTemplateConfigPluginBegin
exports.doraTemplateConfig = {
    enable: true,
    package: 'egg-doras-templateconfig',
    path: path.join(__dirname, "../lib/plugin/egg-doras-templateconfig")
};
// doraTemplateConfigPluginEnd


// doraContentTempPluginBegin
exports.doraContentTemp = {
    enable: true,
    package: 'egg-doras-contenttemp',
    path: path.join(__dirname, "../lib/plugin/egg-doras-contenttemp")
};
// doraContentTempPluginEnd

// doraContentCategoryPluginBegin
exports.doraContentCategory = {
    enable: true,
    package: 'egg-doras-contentcategory',
    path: path.join(__dirname, "../lib/plugin/egg-doras-contentcategory")
};
// doraContentCategoryPluginEnd

// doraContentMessagePluginBegin
exports.doraContentMessage = {
    enable: true,
    package: 'egg-doras-contentmessage',
    path: path.join(__dirname, "../lib/plugin/egg-doras-contentmessage")
};
// doraContentMessagePluginEnd

// doraContentTagsPluginBegin
exports.doraContentTags = {
    enable: true,
    package: 'egg-doras-contenttags',
    path: path.join(__dirname, "../lib/plugin/egg-doras-contenttags")
};
// doraContentTagsPluginEnd


// doraContentPluginBegin
exports.doraContent = {
    enable: true,
    package: 'egg-doras-content',
    path: path.join(__dirname, "../lib/plugin/egg-doras-content")
};
// doraContentPluginEnd

// doraHelpCenterPluginBegin
exports.doraHelpCenter = {
    enable: true,
    package: 'egg-doras-helpcenter',
    path: path.join(__dirname, "../lib/plugin/egg-doras-helpcenter")
};
// doraHelpCenterPluginEnd

// doraSystemNotifyPluginBegin
exports.doraSystemNotify = {
    enable: true,
    package: 'egg-doras-systemnotify',
    path: path.join(__dirname, "../lib/plugin/egg-doras-systemnotify")
};
// doraSystemNotifyPluginEnd

// doraSystemOptionLogPluginBegin
exports.doraSystemOptionLog = {
    enable: true,
    package: 'egg-doras-systemoptionlog',
    path: path.join(__dirname, "../lib/plugin/egg-doras-systemoptionlog")
};
// doraSystemOptionLogPluginEnd



// doraVersionManagePluginBegin
exports.doraVersionManage = {
    enable: true,
    package: 'egg-doras-versionmanage',
    path: path.join(__dirname, "../lib/plugin/egg-doras-versionmanage")
};
// doraVersionManagePluginEnd


// doraMiddleStagePluginBegin
exports.doraMiddleStage = {
    enable: true,
    package: 'egg-doras-middlestage',

};
// doraMiddleStagePluginEnd


// doraMailTemplatePluginBegin
exports.doraMailTemplate = {
    enable: true,
    package: 'egg-doras-mailtemplate',
    path: path.join(__dirname, "../lib/plugin/egg-doras-mailtemplate")
};
// doraMailTemplatePluginEnd



// PLUGIN_NORMALPLUGIN_END



for (const pluginItem in pluginConfigs) {
    if (pluginConfigs.hasOwnProperty(pluginItem)) {
        const element = pluginConfigs[pluginItem];
        exports[pluginItem] = element;
    }
}



// EGGPLUGINCONFIG