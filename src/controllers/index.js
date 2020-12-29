const UserCtl = require('./UserCtl');
const DocCtl = require('./DocCtl');
const CommentCtl = require('./CommentCtl');

const koabody = require('koa-body');

// const { logger } = require('../config/logger');

function controllersRouters(router) {

    router.post('/webapi/login', koabody(), async ctx => {
        await UserCtl.userLogin(ctx);
    });


    router.post('/webapi/publish/doc', koabody({
        jsonLimit: 200 * 1024 * 1024,
        formLimit: 200 * 1024 * 1024,
        textLimit: 200 * 1024 * 1024,
        formidable: {
            maxFieldsSize: 200 * 1024 * 1024,
        }
    }), async ctx => {
        await DocCtl.DocAdd(ctx);
    });

    router.post('/webapi/publish/accessable', koabody(), async ctx => {
        ctx.body = {
            code: '000000',
            msg: '登录状态',
            data: null
        }
    })


    router.post('/webapi/publish/comment', koabody(), async ctx => {
        await CommentCtl.CommnetAdd(ctx);
    });


    router.post('/webapi/register', koabody(), async ctx => {
        await UserCtl.userRegister(ctx);
    });


    router.post('/webapi/upload/image', koabody({
        multipart: true, // 支持文件上传
        encoding: 'gzip',
    }), async ctx => {
        await UploadCtl.UploadImage(ctx);
    });

    router.get('/webapi/logout', async ctx => {
        await UserCtl.userLogout(ctx);
    });

}

module.exports = {
    controllersRouters
}