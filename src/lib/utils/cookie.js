
function getCookie(keyName, req, res) {
    // 服务器端读取cookie
    // req.cookie = {}
    let cookies = req.headers.cookie ? req.headers.cookie.split(';') : [];
    let result = '';
    if (cookies.length > 0) {
        cookies.forEach(item => {
            if (item) {
                let cookieArray = item.split('=')
                if (cookieArray && cookieArray.length > 0) {
                    let key = cookieArray[0].trim()
                    let value = cookieArray[1] ? cookieArray[1].trim() : undefined
                    if (key == keyName) {
                        result = value;
                    }
                }
            }
        })
    }
    return result;
}

// 浏览器端获取cookie
function clientBrowserGetCookie(keyName, doc) {
    let cookies = doc.cookie ? doc.cookie.split(';') : [];
    let result = '';
    if (cookies.length > 0) {
        cookies.forEach(item => {
            if (item) {
                let cookieArray = item.split('=')
                if (cookieArray && cookieArray.length > 0) {
                    let key = cookieArray[0].trim()
                    let value = cookieArray[1] ? cookieArray[1].trim() : undefined
                    if (key == keyName) {
                        result = value;
                    }
                }
            }
        })
    }
    return result;
}

// 服务器端设置cookie
function setCookie(key, value, req, res) {
    // todo
    // res.setHeader('Set-Cookie', `key1=value1;httpOnly;expires=${getExpireTime()}`)
}


export {
    getCookie,
    clientBrowserGetCookie
}