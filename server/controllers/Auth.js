const { Users } = require("../models")

exports.validateUser = async (form) => {
    const user = await Users.findOne({
        where: {
            email: form.body.email
        }
    })

    return form.body.password === user.dataValues.password
}

exports.registerUser = async (form) => {
    if (form.body.password !== form.body.confirmPassword) {
        // Send new form and ask to re-complete
    }

    const user = Users.build({
        firstName: form.body.firstName,
        lastName: form.body.lastName,
        email: form.body.email,
        password: form.body.password
    })

    user.save()

    return true
}