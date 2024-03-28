const { Users } = require("../models")

exports.validateUser = async (form) => {
    const user = await Users.findOne({
        where: {
            email: form.body.email
        }
    })

    return form.body.password === user.dataValues.password
}