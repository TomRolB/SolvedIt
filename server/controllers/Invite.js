const {Users, IsInClass, InviteCode} = require("../models");
const crypto = require("crypto")
const Auth = require("./Auth")

function generateSixDigitsCode() {
    const randomBytes = crypto.randomBytes(3)
    return randomBytes.toString("hex")
}

exports.createOneTimeCodeIfValid = async (classId, email) => {
    const dbUser = await Users.findOne({
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

    return {
        wasSuccessful: true,
        inviteCode: inviteCode
    }
}

exports.createManyTimesCodeIfValid = async (classId, expiration) => {
    const inviteCode = generateSixDigitsCode()
    await InviteCode.build({
        classId: classId,
        code: inviteCode,
        codeType: "many-times",
        userId: null,
        expiration: expiration
    }).save()

    return {
        wasSuccessful: true,
        inviteCode: inviteCode
    }
}

async function successfulCodeUsage(dbCodeRegister, userId) {
    // User joins class
    await IsInClass
        .build({
            userId: userId,
            classId: dbCodeRegister.classId,
        })
        .save()

    // Increment the count of users that used this code
    await dbCodeRegister
        .set({userCount: dbCodeRegister.userCount + 1})
        .save()

    return {
        wasSuccessful: true,
        classId: dbCodeRegister.classId
    }
}

exports.joinWithCode = async (code, uuid) => {
    // 1. Check whether the code exists
    // 2. Check whether the code is one-time, and if it corresponds to this user
    // 3. If not, it's many-times. Check whether it expired

    const dbCodeRegister = await InviteCode.findOne({
        where: {
            code: code
        }
    })

    // Does the code even exist?
    if (dbCodeRegister == null) return {
        wasSuccessful: false,
        errorMessage: "Invalid code (does not exist)",
    }

    const currentUserId = Auth.getUserId(uuid).id
    // Is it a one-time code?
    if (dbCodeRegister.userId === currentUserId) {
        return await successfulCodeUsage(dbCodeRegister, currentUserId)
    }

    // Is it a many-times code?
    if (dbCodeRegister.codeType === "many-times") {
        if (dbCodeRegister.expiration < Date.now()) return {
            wasSuccessful: false,
            errorMessage: "This code has expired"
        }
        else {
            return await successfulCodeUsage(dbCodeRegister, currentUserId);
        }
    }

    // Default
    return {
        wasSuccessful: false,
        errorMessage: "Invalid code (invalid state)"
    }
};