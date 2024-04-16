

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
            allowNull: true, // must be null for many-times code
            validate: {
                nullConstraint(value) {
                    if (value != null) {
                        if (this.codeType === "many-times") {
                            throw new Error("userId must be null for many-times code")
                        }
                    } else {
                        if (this.codeType === "one-time") {
                            throw new Error("userId cannot be null for one-time code")
                        }
                    }
                }
            }
        },
        expiration: {
            type: DataTypes.DATE,
            allowNull: true, // must be null for one-time code
            validate: {
                nullConstraint(value) {
                    if (value == null) {
                        if (this.codeType === "many-times") {
                            throw new Error("Expiration cannot be null for many-times code")
                        }
                    } else {
                        if (this.codeType === "one-time") {
                            throw new Error("expiration must be null for one-time code")
                        }
                    }
                }
            }
        },
        userCount: {
            type: DataTypes.SMALLINT,
            defaultValue: 0,
            validate: {
                nullConstraint(value) {
                    if (this.codeType === "one-time" && value > 1) {
                        throw new Error("userCount must be 0 or 1 for one-time codes")
                    }
                }
            }
        }
    })
    InviteCode.hasOne(Users)
    InviteCode.beforeCreate((inviteCode, options) => {

    })

    return InviteCode
}