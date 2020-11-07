const fs = require('fs');
const path = require('path');
const themePath = `/Users/dora/Downloads/mnml-ghost-theme-master`;


function appendTxtToFileByLine(targetPath, line, targetStr) {
    const fileData = fs.readFileSync(targetPath, 'utf8').split('\n');
    fileData.splice(fileData.length - line, 0, targetStr);
    fs.writeFileSync(targetPath, fileData.join('\n'), 'utf8');
}

function modifyFileByPath(targetPath, replaceStr, targetStr) {
    var readText = fs.readFileSync(targetPath, 'utf-8');
    // var reg = new RegExp(replaceStr, "g")
    var newRenderContent = readText.replace(replaceStr, targetStr);
    fs.writeFileSync(targetPath, newRenderContent);
}

let allThemeFiles = [];

// 需要全局替换的标签
const globalTagsStr = [{
    old: "{{{body}}}",
    new: "{% block content %}{% endblock %}"
}, {
    old: "{{ghost_head}}",
    new: '{% include "./public/header.html" %}'
}, {
    old: "{{ghost_foot}}",
    new: '{% include "./public/footer.html" %}'
}, {
    old: 'src="{{img_url feature_image}}" alt="{{title}}',
    new: 'src="{{item.sImg}}" alt="{{item.title}}'
}, {
    old: "feature_image",
    new: "item.sImg"
}, {
    old: 'profile_image',
    new: 'author.logo'
}, {
    old: "@site",
    new: "site"
}, {
    old: "{{pagination}}",
    new: '{% include "./public/pagination.html" %}'
}, {
    old: "{{!< default}}",
    new: '{% extends "./default.html" %}'
}, {
    old: '{{/if}}',
    new: "{% endif %}"
}]


const readDir = (entry) => {
    const dirInfo = fs.readdirSync(entry);
    dirInfo.forEach(item => {
        const location = path.join(entry, item);
        const info = fs.statSync(location);
        if (info.isDirectory()) {
            console.log(`dir:${location}`);
            readDir(location);
        } else {
            console.log(`file:${location}`);
            // allThemeFiles.push(location);
            for (const targetTag of globalTagsStr) {
                modifyFileByPath(location, targetTag.old, targetTag.new);
            }
        }
    })
}
readDir(themePath);