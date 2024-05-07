module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("Question", {
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
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
    return Question
}