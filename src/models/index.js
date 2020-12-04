const { mysqldb } = require('../config/mysqldb');

//表结构导入

// 用户表
const { User, t_user } = require('./User');
// User.init(t_user, { sequelize: mysqldb, modelName: 'm_user' }).sync({force: true})
User.init(t_user, { sequelize: mysqldb, modelName: 'm_user' });

// 监控项目表     
const { Doc, t_doc } = require('./Doc');
Doc.init(t_doc, { sequelize: mysqldb, modelName: 'm_doc' });

// 监控项目监控功能配置表     
const { Comment, t_comment } = require('./Comment');
Comment.init(t_comment, { sequelize: mysqldb, modelName: 'm_comment' });


const { Category, t_category } = require('./Category');
Category.init(t_category, { sequelize: mysqldb, modelName: 'm_category' });




module.exports = {
    Comment,
    User,
    Doc,
    Category
}
