const routeList = [
    '/',
    '/home*',
    '/doc*',
    '/publish*',
    '/_next/*',
    '/user*',
    '/static/*'
]


function nextRouters(router, handle) {

    // 交给nextjs动态路由处理
    // router.all('/api/post/*', async ctx => {
    //     await handle(ctx.req, ctx.res);
    //     ctx.respond = false;
    // });

    // 首页跳转
    // router.get('/', async ctx => {
    //     ctx.response.redirect('/home');
    // });


    // 交给nextjs动态路由处理
    router.all('/api/get/*', async ctx => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    routeList.forEach(route => {

        router.get(route, async ctx => {
            await handle(ctx.req, ctx.res);
            ctx.respond = false;
        });

    });

}

module.exports = {
    nextRouters
};
