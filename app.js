const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');
const koajwt = require('koa-jwt');
const koabody = require('koa-body');
const path = require('path');
const send = require('koa-send');
const { logger } = require('./src/config/logger');
const { SECRET_SALT, APP_COOKIE_KEY } = require('./src/config/config');
const UserCtl = require('./src/controllers/UserCtl');
const DocCtl = require('./src/controllers/DocCtl');
const CommentCtl = require('./src/controllers/CommentCtl');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: true });

const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    // 交给nextjs动态路由处理
    // router.all('/api/post/*', async ctx => {
    //     await handle(ctx.req, ctx.res);
    //     ctx.respond = false;
    // });

    // 交给nextjs动态路由处理
    router.all('/api/get/*', async ctx => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });


    router.post('/api/login', koabody(), async ctx => {
        await UserCtl.userLogin(ctx);
    });


    router.post('/api/publish/doc', koabody({
        jsonLimit: 200 * 1024 * 1024,
        formLimit: 200 * 1024 * 1024,
        textLimit: 200 * 1024 * 1024,
        formidable: {
            maxFieldsSize: 200 * 1024 * 1024,
        }
    }), async ctx => {
        await DocCtl.DocAdd(ctx);
    });

    router.post('/api/publish/accessable', koabody(), async ctx => {
        ctx.body = {
            code: '000000',
            msg: '登录状态',
            data: null
        }
    })


    router.post('/api/publish/comment', koabody(), async ctx => {
        await CommentCtl.CommnetAdd(ctx);
    });


    router.post('/api/register', koabody(), async ctx => {
        await UserCtl.userRegister(ctx);
    });


    router.post('/api/upload/image', koabody({
        multipart: true, // 支持文件上传
        encoding: 'gzip',
    }), async ctx => {
        await UploadCtl.UploadImage(ctx);
    });

    router.get('/logout', async ctx => {
        await UserCtl.userLogout(ctx);
    });

    // 交给nextjs处理的界面路径
    router.get('/home*', async ctx => {
        // logger.info(ctx, 'router ctx');
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });


    router.get('/doc*', async ctx => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    router.get('/publish*', async ctx => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });


    router.get('/_next/*', async ctx => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    router.get('/user*', async ctx => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    router.get('/static/*', async ctx => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    // 监控项可视化目录
    // router.get('/public/display/*', async ctx => {
    //     await send(ctx, ctx.path, { root: __dirname + '/' });
    // });

    // 上传图片目录
    router.get('/public/images/*', async ctx => {
        await send(ctx, ctx.path, { root: __dirname + '/' });
    });

    router.get('/', async ctx => {
        ctx.response.redirect('/home');
    });

    // 中间件对token进行验证
    server.use(async (ctx, next) => {
        // logger.info(`cookie## ${ctx.cookies.get('febo_cookie')}`);
        ctx.set("Access-Control-Allow-Credentials", true);
        return next().catch((err) => {
            if (err.status === 401) {
                if (ctx.method === 'GET') {
                    ctx.response.redirect('/user/login');
                } else {
                    ctx.body = {
                        code: '400001',
                        msg: '登录信息失效，请重新登录！',
                        token: null
                    }
                }
            } else {
                throw err;
            }
        })
    });

    server.use(koajwt({ secret: SECRET_SALT, cookie: APP_COOKIE_KEY }).unless({
        // 登录接口不需要验证
        // 排除需要token验证的接口
        path: [/^\/_next/, '/.next', '/api/post/common/upload', '/user/loginVerification',
            '/api/post/common/query', '/api/post/common/list', '/api/post/common/update',
            /^\/static/, '/user/login', '/api/user', '/api/login', '/api/publish/doc',
            '/api/publish/comment',
            /^\/home/, /^\/doc/, '/']
    }));


    server.use(router.routes());

    // 防止出现控制台报404错误
    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next();
    });

    server.listen(9077, (err) => {
        if (err) logger.error(err);
        logger.info('bamboo server is running at http://localhost:9077');
        // console.log('server is running at http://localhost:9068');
    });


})
