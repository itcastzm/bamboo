/**
 * 定义Doc 文章表
 */
const { Model, DataTypes } = require('sequelize');
class Doc extends Model { }

const t_doc = {
    id: { type: DataTypes.UUID, primaryKey: true },
    doc_name: { type: DataTypes.STRING, comment: '文章名称' },
    path_url: { type: DataTypes.STRING, comment: '文章地址' },
    author_id: { type: DataTypes.UUID, comment: '文章作者id' },
    author_name: { type: DataTypes.STRING, comment: '文章作者名称' },
    category_id: { type: DataTypes.UUID, comment: '文章分类id' },
    category_name: { type: DataTypes.STRING, comment: '文章分类名' },
    ext: { type: DataTypes.STRING, comment: '扩展字段' },
    ext2: { type: DataTypes.STRING, comment: '扩展字段2' },
    status: { type: DataTypes.SMALLINT, defaultValue: '2', comment: '用户状态，1：未启用,2: 启用，3：停用' },
    flag: { type: DataTypes.SMALLINT, comment: '逻辑删除标识 0 表示未删除 1 表示逻辑删除', defaultValue: '0', allowNull: false, },
}

module.exports = {
    Doc,
    t_doc
}