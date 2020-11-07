# DoraCMS-SQL 2.1.7

![DoraCMS](https://ae01.alicdn.com/kf/H114ba4fd0eab4f36a4b16d970e11222dz.png "DoraCMS")


## DoraCMS 视频简介

[DoraCMS 视频简介](https://www.bilibili.com/video/av77251776/)  

## DoraCMS 更新日志

[DoraCMS 更新日志](https://www.doracms.com/others/update/)  


## 说明

### DoraCMS 使用的技术栈：

```
1、nodejs 12 + eggjs 2
2、vue-cli
3、mariadb 4+
```

文档： [DoraCMS 开发文档](https://www.doracms.com)  
API： [DoraCMS API文档](https://www.html-js.cn/static/apidoc/index.html)  
演示地址： [前端开发俱乐部](https://sql.html-js.cn)  

后台登录： https://sql.html-js.cn/dr-admin  
测试账号：doracms/123456  

### DoraCMS 安装：

**创建项目需要的数据库,登录MySQL 创建数据库**,

```
create database doracms;
```

**查看数据库,是否创建成功,看到有 doracms的数据库,就创建成功了**

```
show databases;
```

**登录数据库,使用数据库,**

```
use doracms;
```

返回 Database changed 说明成功,下一步

**导入SQL文件,生成数据库表,SQL文件在DoraCMS 的 databak 目录,**

目录改成,自己的 doracms.sql 文件目录

```
source D:\ProjectList\NodeJS\DoraCMS\databak\doracms.sql
```

导入完成后,配置数据库
> /app/config/config.local.js

```
// 配置mysql信息
sequelize: {
    dialect: 'mysql',
    host: '127.0.0.1', // 本地
    port: 3306,
    database: 'doracms', //mysql database dir
    username: "root",
    password: "123456",
    delegate: 'model'
},
```

**配置完,运行项目**

```
npm run dev
```
查看有没有报错,没有直接访问,http://127.0.0.1:10003 


### 首页
```javascript
http://127.0.0.1:10003
```

### 后台登录
```javascript
http://127.0.0.1:10003/dr-admin
登录账号：doramart/123456    doracms/123456
```


## 技术交流群
<img width="650" src="http://cdn.html-js.cn/contactbywechatqq1.jpg" alt="">


### 捐赠
如果你发现DoraCMS很有用，可以请生哥喝杯咖啡(⊙o⊙)哦
<img width="650" src="http://cdn.html-js.cn/payme.jpg" alt="">

# LICENSE

MIT


