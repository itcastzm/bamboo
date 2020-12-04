const log4js = require('log4js');

// log4js 的配置
log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'bamboo.log' }
    },
    categories: {
        default: { appenders: ['everything'], level: 'debug' },
        db: { appenders: ['everything'], level: 'debug' }
    }
});


const logger = log4js.getLogger();

module.exports = {
    logger
}