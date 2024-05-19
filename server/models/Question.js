module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("Question", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
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
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })

    Question.associate = (models) => {
        Question.hasMany(models.Answer, {foreignKey: "questionId"})
        Question.belongsTo(models.Users, {foreignKey: "userId"})
        Question.hasMany(models.TaggedBy, {foreignKey: "questionId"})
    }

    return Question
}