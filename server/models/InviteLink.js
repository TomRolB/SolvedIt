module.exports = (sequelize, DataTypes) =>{
    const InviteLink = sequelize.define("InviteLink", {
        classId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userCount:{
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: true
        }
    });
    InviteLink.associate = (models) =>{
        InviteLink.hasOne(models.Class, {foreignKey: "id"})
    }
    return InviteLink
}