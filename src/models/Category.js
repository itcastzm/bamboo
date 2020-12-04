/**
 *  定义系统各种类型
 */
const { Model, DataTypes } = require('sequelize');
class Category extends Model { }

const t_category = {
    id: { type: DataTypes.UUID, primaryKey: true, comment: '数据id' },
    index: { type: DataTypes.STRING, comment: '类型索引' },
    type: { type: DataTypes.STRING, comment: '类型分类 1 表示项目类型  2 表示项目平台  3 表示监控类型 ' },
    name: { type: DataTypes.STRING, comment: '类型名称' },
    is_system: { type: DataTypes.BOOLEAN, defaultValue: true, comment: '是否系统内置: true 是系统内置  false 用户自定义' },
    ext: { type: DataTypes.STRING, comment: '扩展字段' },
    status: { type: DataTypes.SMALLINT, defaultValue: '1', comment: '类型状态 1 启用  2 不启用' },
    flag: { type: DataTypes.SMALLINT, comment: '逻辑删除标识 0 表示未删除 1 表示逻辑删除', defaultValue: '0', allowNull: false, },
}

module.exports = {
    Category,
    t_category
}