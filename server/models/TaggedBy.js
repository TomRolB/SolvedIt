module.exports = (sequelize, DataTypes) => {
    const TaggedBy = sequelize.define("TaggedBy", {
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return TaggedBy
}