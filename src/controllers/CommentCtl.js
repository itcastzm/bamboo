// const jsonwebtoken = require('jsonwebtoken');
const { Comment } = require('../models/index');
const { logger } = require('../config/logger');
const { v1 } = require('uuid');
const fs = require('fs');
const path = require('path');
const currentPath = process.cwd();
const { Op } = require('sequelize');



// 文章新增接口

async function CommnetAdd(ctx) {
    // 评论语
    let id = ctx.request.body.id;
    let text = ctx.request.body.text;
    // 评论对象主体id  如 文章id
    let obj_id = ctx.request.body.obj_id;
    // 评论对象主体昵称  如文章标题
    let obj_name = ctx.request.body.obj_name;
    // 评论人 昵称
    let user_name = ctx.request.body.user_name;
    // 评论人 id
    let user_id = ctx.request.body.user_id;
    // 对话人 id
    let target_id = ctx.request.body.target_id;
    //对话人 昵称
    let target_name = ctx.request.body.target_name;

    let entity = null;

    // console.log(content, 'content');

    if (id) {
        //更新文章

        // console.log(content, 'content');


    } else {
        //新建评论
        id = v1();

        entity = await Comment.create({
            id,
            obj_id,
            user_name,
            text
        }).then(entity => entity);

        logger.info(`评论创建成功！${entity.id}`);

        if (entity) {

            ctx.body = {
                code: '000000',
                msg: '评论创建成功！',
                data: entity
            }
        } else {
            logger.error(`评论创建失败${entity}`);
            ctx.body = {
                code: '200001',
                msg: '评论创建失败！',
                data: null
            }
        }

    }

}


module.exports = {
    CommnetAdd,
}