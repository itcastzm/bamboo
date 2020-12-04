/**
 * 定义User表
 */
const { Model, DataTypes } = require('sequelize');
class User extends Model { }

const t_user = {
    id: { type: DataTypes.UUID, primaryKey: true },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    birthday: { type: DataTypes.DATE },
    level: { type: DataTypes.SMALLINT, comment: '用户等级' },
    role: { type: DataTypes.SMALLINT, comment: '用户角色' },
    ext: { type: DataTypes.STRING, comment: '扩展字段' },
    status: { type: DataTypes.SMALLINT, defaultValue: '2', comment: '用户状态，1：未启用,2: 启用，3：停用' },
    flag: { type: DataTypes.SMALLINT, comment: '逻辑删除标识 0 表示未删除 1 表示逻辑删除', defaultValue: '0', allowNull: false, },
}

module.exports = {
    User,
    t_user
}