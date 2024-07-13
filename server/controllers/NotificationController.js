const {Notification, IsInClass, Question} = require('../models/')
const NotificationSettings = require("./NotificationSettings")
const GmailService = require('../services/GmailService')
const {getUserId} = require("./Auth");

const emailServices = [GmailService]

async function userCanBeNotified(notification, userId) {
    let classSettings = await NotificationSettings.getNotificationSettingsOfClass(notification.classId, userId)
    let generalSettings = await NotificationSettings.getNotificationSettingsOfClass(null, userId)
    let sender = await IsInClass.findOne({where: {userId: getUserId(notification.uuid).id, classId: notification.classId}})
    //Functions needed ahead
    async function newAnswerCanBeShown(classSettings) {
        let question = await Question.findOne({where: {id: notification.notificationInfo.questionInfo.id}})
        let isCurrentUsersQuestion = question.userId === userId
        let teacherReplied = sender.isTeacher
        let showAnswerCondition = classSettings.newAnswers === "All" && isCurrentUsersQuestion

        if (classSettings.newAnswers === "Teacher's") return {
            canBeShown: showAnswerCondition && teacherReplied,
            byEmail: classSettings.notifyByEmail
        }
        else if (classSettings.newAnswers === "All") return {
            canBeShown: showAnswerCondition,
            byEmail: classSettings.notifyByEmail
        }

        return {canBeShown: false, byEmail: classSettings.notifyByEmail}
    }

    function validationCanBeShown(classSettings) {
        let sameUser = notification.notificationInfo.userId === userId
        let showValidationCondition = classSettings.answerValidation !== "Never" && sameUser
        return {
            canBeShown: showValidationCondition,
            byEmail: classSettings.notifyByEmail
        }
    }

    const isAble = async(notification, classSettings) =>{
        return await notificationTypeCanBeShown(notification.notificationType,
            classSettings.isActive ? classSettings : generalSettings)
    }

    const notificationTypeCanBeShown = async (notificationType, classSettings) => {
        switch (notificationType) {
            case "newQuestion":
                return {canBeShown: classSettings.newQuestions === "All", byEmail: classSettings.notifyByEmail}
            case "newAnswer":
                return await newAnswerCanBeShown(classSettings);
            case "answerValidation":
                return validationCanBeShown(classSettings);
        }
    }
    return await isAble(notification, classSettings);
}

exports.getAllNotifications = async (userId) => {
    let classes = await IsInClass.findAll({where: {userId: userId}})
    let notifications = []
    for(let cl of classes){
        let classNotifications = await Notification.findAll({where: {userId: userId, classId: cl.classId}})
        // console.log("Notifications in class: " + classNotifications.length);

        if(!classNotifications || classNotifications.length === 0) continue

        classNotifications.map(not => notifications.push(not))
    }

    // console.log("Filtered notifications: " + notifications.length) //Notifications to REALLY return

    notifications.sort((a,b) => new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate()) //Sort by date, get the most recent ones
    return notifications;
}

exports.createNotification = async (description) =>{
    function sendEmailIfConfigured(canBeNotified, userId) {
        console.log(`Should send via email: ${canBeNotified.byEmail}`)
        if (canBeNotified.byEmail) {
            emailServices.forEach((service) => {
                service.sendEmail(description, userId)
            })
        }
    }

    const classMates = await IsInClass.findAll({where: {classId: description.classId}})

    for (let classMate of classMates){
        const canBeNotified = await userCanBeNotified(description, classMate.userId);
        if (canBeNotified.canBeShown) {
            await createNotificationEntry(classMate.userId, description);
            sendEmailIfConfigured(canBeNotified, classMate.userId);
        }
    }
}


async function createNotificationEntry(userId, description) {
    await Notification.create({
        userId: userId,
        classId: description.classId,
        title: description.title,
        notificationType: description.notificationType,
        description: description.description,
        wasSeen: false
    })
}