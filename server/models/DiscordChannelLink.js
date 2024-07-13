module.exports = (sequelize, DataTypes) => {
    const DiscordChannelLink = sequelize.define("DiscordChannelLink", {
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        channelId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        }
        , name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return DiscordChannelLink;
}
