module.exports = (sequelize, DataTypes) => {
    const IsInClass = sequelize.define("IsInClass", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    IsInClass.associate = (models) => {
        IsInClass.hasMany(models.Users, {})
    }
    IsInClass.associate = (models) => {
        IsInClass.hasMany(models.Class, {})
    }

    return IsInClass
}