module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define("Answer", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
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
            // if its parent is the question per se, then
            // the parent question is null
            allowNull: true
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

    Answer.associate = (models) => {
        Answer.belongsTo(models.Users, {foreignKey: "userId"})
        Answer.belongsTo(models.Class, {foreignKey: "classId"})
        Answer.belongsTo(models.Question, {foreignKey: "questionId"})
    }

    return Answer
}