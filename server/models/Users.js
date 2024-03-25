module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Users
}