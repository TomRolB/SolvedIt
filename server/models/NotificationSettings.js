module.exports = (sequelize, DataTypes) => {
    const NotificationSettings = sequelize.define("NotificationSettings", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        newQuestions: {
            type: DataTypes.STRING,
            allowNull: false
        },
        newAnswers: {
            type: DataTypes.STRING,
            allowNull: false
        },
        answerValidation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notifyByEmail: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })

    return NotificationSettings
}