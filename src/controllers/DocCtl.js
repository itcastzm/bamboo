// const jsonwebtoken = require('jsonwebtoken');
const { Doc } = require('../models/index');
const { logger } = require('../config/logger');
const { v1 } = require('uuid');
const fs = require('fs');
const path = require('path');
const currentPath = process.cwd();
const { Op } = require('sequelize');



// 删除文件夹工具函数
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


// 查询文件夹中所有文本文件内容  并以对象形式返回
function getAllFileContent(map_content, rootBase, curBase) {

    if (fs.existsSync(curBase)) {
        let files = fs.readdirSync(curBase);
        files.forEach((file, index) => {
            let curPath = curBase + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                getAllFileContent(map_content, rootBase, curPath); //递归查询文件夹
            } else {
                let fileName = curPath.replace(curBase, '');
                let prefix = curBase.replace(rootBase, '');
                // console.log('fileName, prefix', fileName, prefix);
                map_content[`display${prefix}${fileName}`] = fs.readFileSync(curPath, 'utf8');
            }
        });
    }

}


function createDocResourceFile(docBasePath, path_str, doc_cont) {
    let pathArr = path_str.split('/');
    let doc_file_name = pathArr[pathArr.length - 1];
    let ext_type = doc_file_name.split('.')[1];
    let curPath = '';
    logger.info(`path${path_str}`);
    for (let i = 0; i < pathArr.length; i++) {

        if (i == 0) {
            continue; //根目录轮空
        }

        let item = pathArr[i];
        if (i < pathArr.length - 1) {
            curPath = `${curPath}${item}/`;
            let cur_Path = path.join(docBasePath, curPath);
            if (!fs.existsSync(cur_Path)) {
                fs.mkdirSync(cur_Path);
                logger.info(`文章资源目录${cur_Path}创建成功！`)
            }
        } else {
            let cur_Path;

            if (ext_type == 'md') {
                cur_Path = path.join(docBasePath, curPath, 'index.md');
            } else {
                cur_Path = path.join(docBasePath, curPath, doc_file_name);
            }

            if (!fs.existsSync(cur_Path)) {
                fs.writeFile(cur_Path, doc_cont, (err) => {
                    if (err) throw err;
                    logger.info(`文章资源文件${cur_Path}创建成功！`)
                });
            }
        }
    }

}


// 文章新增接口
async function DocAdd(ctx) {
    let content = ctx.request.body.content;
    let contentMap = ctx.request.body.contentMap;
    let id = ctx.request.body.id;
    let path_url = '';
    let doc_name = ctx.request.body.doc_name;
    let entity = null;

    // console.log(content, 'content');

    if (id) {
        //更新文章

        // console.log(content, 'content');


    } else {
        //新建文章
        id = v1();

        entity = await Doc.create({
            id,
            path_url,
            doc_name
        }).then(entity => entity);

        logger.info(`文章创建成功！${entity.id}`);

        // 创建文章目录
        let docBaseDirPath = path.join(currentPath, 'src/docs/', id + '/');
        if (fs.existsSync(docBaseDirPath)) {
            fs.unlinkSync(docBaseDirPath);
        }
        fs.mkdirSync(docBaseDirPath);
        logger.info(`文章根目录：${docBaseDirPath} 创建成功!`)

        //创建文章资源文件
        if (contentMap) {
            for (let p in contentMap) {
                let content = contentMap[p];
                createDocResourceFile(docBaseDirPath, p, content);
            }
        }



        if (entity) {

            ctx.body = {
                code: '000000',
                msg: '文章保存成功！',
                data: entity
            }
        } else {
            logger.error(`文章创建失败！${entity}`);
            ctx.body = {
                code: '200001',
                msg: '文章创建保存失败！',
                data: null
            }
        }

    }

}


async function QueryDocList(ctx) {

}






module.exports = {
    DocAdd,
}