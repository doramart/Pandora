# Pandora 2.1.8

#### 更新内容：
- 服务端代码加入 eslint 校验，并通过 Prettier 格式化（使用 vscode 需要安装对应的插件）
- 修复用户中心分页样式不正确的问题
- 修复使用 ueditor 编辑时，通过剪切板粘贴图片不能上传到cdn的问题
- 添加了markdown 编辑器
- 后台管理添加了选项卡切换
- 修复了广告管理中，添加轮播图广告报错的问题
- 删除了多余的适配文件，不再兼容低版本IE
- 后台管理添加了 io 通知，关键操作会通知到管理员
- 修复找回密码链接跳转不正常的问题
- 为了真正的拥抱开源，从这个版本开始，Pandora 默认使用 Mariadb 数据库，如果您使用的是 mysql，可能需要对数据库文件进行适当处理

![DoraCMS](https://ae01.alicdn.com/kf/H114ba4fd0eab4f36a4b16d970e11222dz.png "DoraCMS")


## Pandora CMS 视频简介

[Pandora CMS 视频简介](https://www.bilibili.com/video/av77251776/)  



## 说明

### Pandora CMS 使用的技术栈：

```
1、nodejs 12 + eggjs 2
2、vue-cli
3、mariadb 10 
```

文档： [Pandora CMS 开发文档](https://www.doracms.com)  
API： [Pandora CMS API文档](https://www.html-js.cn/static/apidoc/index.html)  
演示地址： [前端开发俱乐部](https://sql.html-js.cn)  

后台登录： https://sql.html-js.cn/dr-admin  
测试账号：doracms/123456  

### DoraCMS 安装：

**创建项目需要的数据库，登录 MySQL 创建数据库**

```
create database doracms;
```

**查看数据库是否创建成功，看到有 doracms 的数据库，就创建成功了**

```
show databases;
```

**登录数据库，使用数据库，**

```
use doracms;
```

**导入SQL文件，生成数据库表，SQL 文件在 DoraCMS 的 databak 目录，**

> 目录改成，自己的 doracms.sql 文件目录

```
source D:\ProjectList\NodeJS\DoraCMS\databak\doracms.sql
```

**代码根目录安装依赖**

```
npm i --registry=https://registry.npm.taobao.org
```

**修改配置文件**
> /app/config/config.local.js

```
// 配置 mariadb 信息
sequelize: {
    dialect: 'mariadb'，
    host: '127.0.0.1'， // 本地
    port: 3306，
    database: 'doracms'， //mariadb database dir
    username: "root"，
    password: "123456"，
    delegate: 'model'
}，
```

**运行项目**

```
npm run dev
```

### 前台访问
```javascript
http://127.0.0.1:10003
```

### 后台登录
```javascript
http://127.0.0.1:10003/dr-admin
登录账号：doramart/123456    doracms/123456
```

### mongodb 版本
[DoraCMS mongodb 源码](https://github.com/doramart/DoraCMS)   
[DoraCMS mongodb 版本预览](https://www.html-js.cn/) 



## 技术交流群
<img width="650" src="http://cdn.html-js.cn/contactbywechatqq1.jpg" alt="">


### 捐赠
如果你发现DoraCMS很有用，可以请生哥喝杯咖啡(⊙o⊙)哦
<img width="650" src="http://cdn.html-js.cn/payme.jpg" alt="">

# LICENSE

MIT


