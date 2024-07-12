module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Notification", {
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
        notificationType: {
            type: DataTypes.STRING,
            validate: {
                isIn: [["newQuestion", "newAnswer", "answerValidation"]]
            },
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        wasSeen:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })
}