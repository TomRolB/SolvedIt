const {Users, IsInClass, InviteCode} = require("../models");
const crypto = require("crypto")

function generateSixDigitsCode() {
    const randomBytes = crypto.randomBytes(6)
    return randomBytes.toString("hex")
}

exports.createOneTimeCodeIfValid = async (classId, email) => {
    console.log(`Received classId ${classId}`)
    const dbUser = await Users.findOne({
        where: {
            email: email
        }
    })

    // 1. email should correspond to an existing account
    // 2. user should not be already enrolled

    console.log("Checking if user is null")

    if (dbUser == null) return {
        wasSuccessful: false,
        errorMessage: "Invalid email",
    }

    const userInClass = await IsInClass.findOne({
        where: {
            classId: classId,
            userId: dbUser.id
        }
    })

    if (userInClass != null) return {
        wasSuccessful: false,
        errorMessage: "The user has already joined the class",
    }

    const inviteCode = generateSixDigitsCode()
    await InviteCode.build({
        classId: classId,
        code: inviteCode,
        codeType: "one-time",
        userId: dbUser.id,
        expiration: null
    }).save()

    console.log("The code was created")

    return {
        wasSuccessful: true,
        inviteCode: inviteCode
    }
}
