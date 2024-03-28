const { Users } = require("../models")

exports.validateUser = async (form) => {
    const formEmail = form.body.email
    const formPassword = form.body.password

    const user = await Users.findOne({
        where: {
            email: formEmail
        }
    })

    if (user === null) return false

    const actualPassword = user.dataValues.password

    return formPassword === actualPassword
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