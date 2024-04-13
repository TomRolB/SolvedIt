const { Users } = require("../models")
const crypto = require("crypto")

let sessions = {}

exports.validateUser = async (form) => {
    const formEmail = form.body.email
    const formPassword = form.body.password

    const user = await Users.findOne({
        where: {
            email: formEmail
        }
    })

    if (user === null) return null

    const actualPassword = user.dataValues.password
    if (formPassword !== actualPassword) return null

    //TODO: Handle user trying to login when already having a session

    const uuid = crypto.randomUUID()
    sessions[uuid] = user.id

    return uuid
}

const RegisterResult = {
    SUCCESS: "Successfully registered",
}

exports.registerUser = async (form) => {
    if (form.body.password !== form.body.confirmPassword) {
        // Send new form and ask to re-complete
        return {
            wasSuccessful: false,
            errorMessage: "Passwords do not match",
        }
    }

    const formEmail = form.body.email
    const dbUser = await Users.findOne({
        where: {
            email: formEmail
        }
    })

    if (dbUser !== null) return {
        wasSuccessful: false,
        errorMessage: "This email has already been used",
    }

    const user = Users.build({
        firstName: form.body.firstName,
        lastName: form.body.lastName,
        email: form.body.email,
        password: form.body.password
    })

    user.save()

    const uuid = crypto.randomUUID()
    sessions[uuid] = user.id

    return {
        wasSuccessful: true,
        uuid: uuid
    }
}
