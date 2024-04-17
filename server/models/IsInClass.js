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

    return IsInClass
}