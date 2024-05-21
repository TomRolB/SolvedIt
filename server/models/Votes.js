module.exports = (sequelize, DataTypes) => {
    const Votes = sequelize.define("Votes", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        answerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    })

    Votes.associate = (models) => {
        Votes.belongsTo(models.Users, {foreignKey: "userId"})
        Votes.belongsTo(models.Answer, {foreignKey: "answerId"})
    }

    return Votes
}