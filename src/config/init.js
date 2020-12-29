const { mysqldb } = require('./mysqldb');
const force = true;
const fs = require('fs');
const path = require('path');
const currentPath = process.cwd();
const { v1 } = require('uuid');

// 删除文件夹
function delDir(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}

//初始化数据库
async function initSchema() {
    // mysqldb.query('drop database if exists febo;').then(function () {
    //     mysqldb.query('create database febo').then(() => {
    //         // 清除  mysqldb缓存  重新加载mysqldb
    //         delete require.cache[require.resolve('./mysqldb')];
    //         mysqldb = require('./mysqldb');
    //     });
    // });

    await mysqldb.query('drop database if exists bamboo;').then(function () {

    }).catch(e => {
        console.log(e);
    });
    await mysqldb.query('create database bamboo').then(function () {

    }).catch(e => {
        console.log(e);
    });;

    delete require.cache[require.resolve('./mysqldb')];
}


// 创建系统表

async function initSystemTables() {

    const { mysqldb } = require('./mysqldb');
    // 用户表
    const { User, t_user } = require('../models/User');
    User.init(t_user, { sequelize: mysqldb, modelName: 'm_user' }).sync({ force }).then(function () {
        // 初始账号添加
        var id = v1();
        User.create({
            id,
            phone: '13828459782',
            email: '123@itcast.cn',
            username: 'zhangsan',
            password: '123456'
        });
    });

    // 文章表     
    const { Doc, t_doc } = require('../models/Doc');
    Doc.init(t_doc, { sequelize: mysqldb, modelName: 'm_doc' }).sync({ force });
    // 评论表     
    const { Comment, t_comment } = require('../models/Comment');
    Comment.init(t_comment, { sequelize: mysqldb, modelName: 'm_comment' }).sync({ force });
    // 分类表     
    const { Category, t_category } = require('../models/Category');
    Category.init(t_category, { sequelize: mysqldb, modelName: 'm_category' }).sync({ force }).then(() => {
        // 系统内置类型

        const docList = [
            { index: '000001', type: '1', name: 'react' },
            { index: '000002', type: '1', name: 'vue' },
            { index: '000003', type: '1', name: 'js' },
            { index: '000004', type: '1', name: 'css' },
            { index: '000005', type: '1', name: 'html' },
            { index: '000006', type: '1', name: '小程序' },
            { index: '000007', type: '1', name: 'ssr' },
            { index: '000008', type: '1', name: 'webpack' },
            { index: '000009', type: '1', name: 'nodejs' },
            { index: '000010', type: '1', name: 'typescript' },
            { index: '000011', type: '1', name: 'canvas' },
            { index: '000012', type: '1', name: 'css3' },
            { index: '000013', type: '1', name: 'es6' }
        ];


        function createCategory(list) {
            for (let i = 0; i < list.length; i++) {
                let id = v1();
                let item = list[i];
                item.id = id;
                Category.create({
                    ...item
                });
            }
        }

        // 创建系统内置文章分类
        createCategory(docList);
    });


    // 清空插件目录和监控项可视化目录
    // 删除文件夹工具函数

    // let displayBase = path.join(currentPath, 'public/display/');
    // if (fs.existsSync(displayBase)) {
    //     delDir(displayBase)
    //     fs.mkdirSync(displayBase);
    //     console.log('监控项根目录：' + displayBase + ' 清空成功!');
    // }


}



async function init() {
    await initSchema().then(() => { }).catch(e => {
        console.log(e, 'initSchema 出错！');
    });

    await initSystemTables().then(() => { }).catch(e => {
        console.log(e, 'initSystemTables 出错！');
    });;
}


// 执行脚本
init();







