const { getCookie, clientBrowserGetCookie } = require('./cookie');
const jsonwebtoken = require('jsonwebtoken');
const { secretSalt, APP_COOKIE_KEY } = require('../../config/config');


function getUserInfo(req) {
    let feboCookie = getCookie(APP_COOKIE_KEY, req);
    if (req && feboCookie) {
        return jsonwebtoken.verify(feboCookie, secretSalt);
    } else {
        return undefined;
    }
}

function getUserInfoByDoc(doc) {
    let feboCookie = clientBrowserGetCookie(APP_COOKIE_KEY, doc);
    if (doc && feboCookie) {
        return jsonwebtoken.verify(feboCookie, secretSalt);
    } else {
        return undefined;
    }
}


export {
    getUserInfo,
    getUserInfoByDoc
}