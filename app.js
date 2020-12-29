const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');
const koajwt = require('koa-jwt');
const send = require('koa-send');

const { logger } = require('./src/config/logger');
const { SECRET_SALT, APP_COOKIE_KEY, __PORT__ } = require('./src/config/config');

// 路径模块
const { controllersRouters } = require('./src/controllers');

const { nextRouters } = require('./src/config/next');

// 区分开发生产环境
const dev = process.argv.indexOf('--development') > -1;

const app = next({ dev });

const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    // next 路径处理
    nextRouters(router, handle);
    // 后台接口初始化
    controllersRouters(router);
    // 上传图片静态目录
    router.get('/public/images/*', async ctx => {
        await send(ctx, ctx.path, { root: __dirname + '/' });
    });

    // 中间件对token进行验证 失效处理
    server.use(async (ctx, next) => {
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
        // 排除需要token验证的接口
        path: [
            /^\/_next/,
            '/api/post/common/upload',
            '/user/loginVerification',
            '/api/post/common/query',
            '/api/post/common/list',
            '/api/post/common/update',
            /^\/static/,
            '/user/login',
            '/api/user',
            '/webapi/login',          // 登录接口不需要验证
            '/webapi/publish/doc',
            '/webapi/publish/comment',
            /^\/home/,
            /^\/doc/,
            '/'
        ]
    }));
    server.use(router.routes());
    // 防止出现控制台报404错误
    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next();
    });
    server.listen(__PORT__, (err) => {
        if (err) logger.error(err);
        logger.info(`bamboo server is running at ${__PORT__}`);
    });

})
