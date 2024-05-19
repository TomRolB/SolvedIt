module.exports = (sequelize, DataTypes) => {
    const Tags = sequelize.define("Tags", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    Tags.associate = (models) => {
        Tags.hasMany(models.TaggedBy, {foreignKey: "tagId"})
        Tags.hasOne(models.Class, {foreignKey: "id"})
    }
    return Tags
}