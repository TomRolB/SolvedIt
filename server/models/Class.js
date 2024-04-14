module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define("Class", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    Class.associate = (models) => {
        Class.hasMany(models.IsInClass, {foreignKey: "classId"})
    }

    return Class
}