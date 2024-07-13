module.exports = (sequelize, DataTypes) => {
    const DiscordMessage = sequelize.define("DiscordMessage", {
        questionOrAnswerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        messageId: {
            // Discord IDs have the 'snowflake' format, so we save them as strings
            type: DataTypes.STRING,
            allowNull: false
        },
        threadId: {
            // Discord IDs have the 'snowflake' format, so we save them as strings
            type: DataTypes.STRING,
            allowNull: false
        },
        isAnswer: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })

    // DiscordMessage.associate = (models) => {
    //     DiscordMessage.belongsTo(models.Question, {foreignKey: "id"})
    // }

    return DiscordMessage
}