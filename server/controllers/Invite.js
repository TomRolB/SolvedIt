const Users = require("../models/Users");
const IsInClass = require("../models/IsInClass");
const InviteCode = require("../models/InviteCode");

function generateSixDigitsCode() {
    const randomBytes = crypto.randomBytes(6)
    return randomBytes.toString("hex")
}

export function createOneTimeCodeIfValid(classId, email, expiration) {
    const dbUser = Users.findOne({
        where: {
            email: email
        }
    })

    // 1. email should correspond to an existing account
    // 2. user should not be already enrolled

    if (dbUser == null) return {
        wasSuccessful: false,
        errorMessage: "Invalid email",
    }

    const userInClass = IsInClass.findOne({
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
    InviteCode.build({
        classId: classId,
        code: inviteCode,
        codeType: "one-time",
        userId: dbUser.id,
        expiration: expiration
    }).save()

    return {
        wasSuccessful: true,
        inviteCode: inviteCode
    }
}
