module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Answer", {
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        wasReported: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })
}