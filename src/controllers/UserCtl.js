const jsonwebtoken = require('jsonwebtoken');
const { User } = require('../models/index');
const { logger } = require('../config/logger');
const { SECRET_SALT, APP_COOKIE_KEY } = require('../config/config');
const { v1 } = require('uuid');


// 用户登录接口
async function userLogin(ctx) {
    let username = ctx.request.body.username;
    // 手机号
    let phone = ctx.request.body.phone;
    // 密码
    let password = ctx.request.body.password;
    // 验证码
    let code = ctx.request.body.code;
    // 登录模式
    let mode = ctx.request.body.mode;
    logger.info(`/api/login 用户登录：${username}==>模式${mode}==>密码${password}验证码==>${code}`);

    // 登录
    // User.findAndCountAll()
    let rs = await User.findAll({ where: { username: username } }).then(entities => entities);

    if (rs && rs.length) {
        //查询到账号信息
        let userinfo = rs[0];
        // 验证码登录
        // if (mode == '1' && code != '888888') {
        //     logger.info(`/api/login 用户登录失败,验证码错误！：${phone}==>模式${code}==>密码${password}验证码==>${code}`);
        //     ctx.body = {
        //         code: 301,
        //         msg: '登录失败验证码错误！',
        //         token: null
        //     }

        // } else if (mode == '2' && password != userinfo.password) {
        //     // 密码登录
        //     // console.log(mode == '2' && password && (password != userinfo.password), userinfo.password);
        //     logger.info(`/api/login 用户登录失败,密码错误！：${phone}==>模式${code}==>密码${password}验证码==>${code}`);
        //     ctx.body = {
        //         code: 301,
        //         msg: '登录失败密码错误！',
        //         token: null
        //     }
        // } else {

        if (userinfo.password == password) {

            let token = jsonwebtoken.sign(
                { name: userinfo.username, id: userinfo.id, phone: userinfo.phone },  // 加密userToken
                SECRET_SALT,
                { expiresIn: '2h' }
            );

            ctx.cookies.set(
                APP_COOKIE_KEY,
                token,    //可替换为token
                {
                    // domain: 'localhost:9068',  // 写cookie所在的域名
                    // path: '/',       // 写cookie所在的路径
                    maxAge: 2 * 60 * 60 * 1000, // cookie有效时长 两个小时
                    // expires: new Date('2020-12-11'),  // cookie失效时间
                    httpOnly: false,  // 是否只用于http请求中获取
                    overwrite: true  // 是否允许重写
                }
            )
            ctx.body = {
                code: '000000',
                msg: '登录成功',
                token: token
            }
        } else {
            logger.info(`密码错误: ${username}`);
            ctx.body = {
                code: '200001',
                msg: `密码错误: ${username}`
            }
        }

    } else {
        // 登录失败, 用户名密码不正确
        // if (mode == '1' && code == '888888') {
        logger.info(`不存在该用户: ${username},是否需要创建账号！`);
        ctx.body = {
            code: 20001,
            msg: `不存在该用户: ${username},是否需要创建账号！`
        }
        // } else {
        //     logger.info(`不存在该用户: ${phone}`);
        //     ctx.body = {
        //         code: 400,
        //         msg: `不存在该用户: ${phone}`
        //     }
        // }

    }
}

// 用户登出接口
async function userLogout(ctx) {
    ctx.cookies.set(
        APP_COOKIE_KEY, '',    //可替换为token
        {
            maxAge: 10 * 60 * 1000, // cookie有效时长
            expires: new Date(0),  // cookie失效时间
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: false  // 是否允许重写
        }
    )
    ctx.body = {
        code: 200,
        msg: '注销成功!',
        token: null
    }
}

// 用户注册接口

async function userRegister(ctx) {
    let phone = ctx.request.body.phone;
    let password = ctx.request.body.password;
    let id = v1();

    let entity = await User.create({
        id,
        phone,
        password
    }).then(entity => entity);

    if (entity) {
        logger.info(`用户创建成功！${entity.id}`);
        let token = jsonwebtoken.sign(
            { id, phone },  // 加密userToken
            SECRET_SALT,
            { expiresIn: '1h' }
        );

        ctx.cookies.set(
            APP_COOKIE_KEY,
            token,    //可替换为token
            {
                // domain: 'localhost:9068',  // 写cookie所在的域名
                // path: '/',       // 写cookie所在的路径
                maxAge: 2 * 60 * 60 * 1000, // cookie有效时长 两个小时
                // expires: new Date('2020-12-11'),  // cookie失效时间
                httpOnly: false,  // 是否只用于http请求中获取
                overwrite: true  // 是否允许重写
            }
        )
        ctx.body = {
            code: '000000',
            msg: '登录成功',
            token: token
        }
    } else {
        logger.error(`用户创建失败！${entity}`);
        ctx.body = {
            code: '200001',
            msg: '用户创建失败！',
            token: null
        }
    }
}

// 密码修改
async function userPwdUpdate(ctx) {
    let phone = ctx.request.body.phone;
    let password = ctx.request.body.password;
    let oldPwd = ctx.request.body.oldPwd;

    let old_entity = await User.findOne({ where: { phone } })
        .then((entity) => entity ? entity.toJSON() : null);

    if (old_entity.password == oldPwd) {
        let entity = await User.update({ password }, { 'where': { phone } })
            .then((entity) => entity);
        if (entity) {
            logger.info(`用户密码修改成功！${entity.id}`);
            ctx.body = {
                code: 200,
                msg: '登录成功',
                data: {
                    phone,
                    id: entity.id
                }
            }
        } else {
            logger.error(`用户密码修改失败！${phone}`);
            ctx.body = {
                code: 200001,
                msg: '用户密码修改失败！',
                data: null
            }
        }
    } else {
        logger.info(`提交的旧密码错误`);
        ctx.body = {
            code: 200010,
            msg: `提交的旧密码错误`,
            data: null
        }
    }


}



module.exports = {
    userLogin,
    userRegister,
    userPwdUpdate,
    userLogout
}