/**
 * 定义Doc 文章表
 */
const { Model, DataTypes } = require('sequelize');
class Comment extends Model { }

const t_comment = {
    id: { type: DataTypes.UUID, primaryKey: true, comment: '评论id' },
    text: { type: DataTypes.STRING, comment: '评论' },
    obj_id: { type: DataTypes.UUID, comment: '评论对象' },
    obj_name: { type: DataTypes.STRING, comment: '评论对象名称' },
    user_id: { type: DataTypes.UUID, comment: '评论人id' },
    user_name: { type: DataTypes.STRING, comment: '评论人名称' },
    target_id: { type: DataTypes.UUID, comment: '被评论人id' },
    target_name: { type: DataTypes.STRING, comment: '被评论人名称' },
    ext: { type: DataTypes.STRING, comment: '扩展字段' },
    status: { type: DataTypes.SMALLINT, defaultValue: '2', comment: '用户状态，1：未启用,2: 启用，3：停用' },
    flag: { type: DataTypes.SMALLINT, comment: '逻辑删除标识 0 表示未删除 1 表示逻辑删除', defaultValue: '0', allowNull: false, },
}

module.exports = {
    Comment,
    t_comment
}