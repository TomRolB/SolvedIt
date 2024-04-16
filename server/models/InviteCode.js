

module.exports = (sequelize, DataTypes) => {
    const InviteCode = sequelize.define("InviteCode", {
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        codeType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [["one-time", "many-times"]],
                    msg: "Must be one-time or many-times"
                }
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true // must be null for many-times code
        },
        expiration: {
            type: DataTypes.DATE,
            allowNull: true, // must be null for one-time code
            validate: {
                nullIfOneTime(value) {

                }
            }
        },
        userCount: {
            type: DataTypes.SMALLINT,
            allowNull: true // must be null for one-time code
        }
    })
    InviteCode.hasOne(Users)

    return InviteCode
}