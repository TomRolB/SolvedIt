const {NotificationSettings} = require("../models/")

exports.getNotificationSettingsOfClass = async (classId, userId) => await NotificationSettings.findOne({
    where: {
        classId: classId,
        userId: userId
    }
});

exports.updateNotificationSettings = async (classId, userId, info, isActive) => {
    NotificationSettings.update({
        newQuestions: info.newQuestions,
        newAnswers: info.newAnswers,
        answerValidation: info.answerValidation,
        notifyByEmail: info.notifyByEmail,
        isActive: isActive
    }, {
        where: {
            classId: classId,
            userId: userId
        }
    });
}

exports.createNotificationSettings = async (userId, classId) => {
   await NotificationSettings
        .create({
            userId: userId,
            classId: classId,
            newQuestions: "None",
            newAnswers: "None",
            answerValidation: "Never",
            notifyByEmail: false,
            isActive: false
        })
}