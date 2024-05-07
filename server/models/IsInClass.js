module.exports = (sequelize, DataTypes) => {
    const IsInClass = sequelize.define("IsInClass", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        permissions: {
            type: DataTypes.STRING,
            validate: {
                isIn: [["normal", "admin", "owner"]]
            }
        },
        isTeacher: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                teacherMustBeAdmin(value) {
                    if (value && this.permissions === "normal") {
                        throw new Error("A teacher must have admin or owner permissions")
                    }
                }
            }
        }
    });

    return IsInClass
}