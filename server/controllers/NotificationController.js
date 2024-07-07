const {Notification, IsInClass, Question} = require('../models/')
const NotificationSettings = require("./NotificationSettings")
const GmailService = require('../services/GmailService')
const {getUserId} = require("./Auth");

const emailServices = [GmailService]

async function userCanBeNotified(notification, userId) {
    let classSettings = await NotificationSettings.getNotificationSettingsOfClass(notification.classId, userId)
    let generalSettings = await NotificationSettings.getNotificationSettingsOfClass(null, userId)
    let sender = await IsInClass.findOne({where: {userId: getUserId(notification.uuid).id, classId: notification.classId}})
    console.log("User id: " + userId);
    const notificationTypeCanBeShown = async (notificationType, classSettings) => {
        console.log("Notification type" + notificationType);
        switch (notificationType) {
            case "newQuestion":
                return {canBeShown: classSettings.newQuestions === "All", byEmail: classSettings.notifyByEmail}
            case "newAnswer":
                let question = await Question.findOne({where:{id: notification.notificationInfo.questionInfo.id}})
                let isCurrentUsersQuestion = question.id === userId
                let teacherReplied = sender.isTeacher
                return {canBeShown: classSettings.newAnswers === "All" && isCurrentUsersQuestion && teacherReplied, byEmail: classSettings.notifyByEmail}
            case "answerValidation":
                let sameUser = notification.notificationInfo.userId === userId
                // return isTeacher
                //     ? {
                //         canBeShown: classSettings.answerValidation === "Teacher's" && sameUser,
                //         byEmail: classSettings.notifyByEmail
                //     }
                //     : {
                //         canBeShown: classSettings.answerValidation === "Always" && sameUser,
                //         byEmail: classSettings.notifyByEmail
                //     }
                let showCond = classSettings.answerValidation !== "Never" && sameUser
                console.log("Verification can be notified: " + showCond);
                return {
                    canBeShown: showCond,
                    byEmail: classSettings.notifyByEmail
                }
        }
    }
    const isAble = async(notification, classSettings) =>{
        if(classSettings.isActive){
            return await notificationTypeCanBeShown(notification.notificationType, classSettings)
        }
        return await notificationTypeCanBeShown(notification.notificationType, generalSettings)
    }
    let able = await isAble(notification, classSettings)
    console.log("Is able to be shown: " + able.canBeShown);
    return able;
}

exports.getAllNotifications = async (userId) => {
    let classes = await IsInClass.findAll({where: {userId: userId}})
    console.log("Classes amount: " + classes.length);
    let notifications = []
    for(let cl of classes){
        let classNotifications = await Notification.findAll({where: {userId: userId, classId: cl.classId}})
        console.log("Notifications in class: " + classNotifications.length);
        if(!classNotifications || classNotifications.length === 0) continue
        classNotifications.map(not => notifications.push(not))
    }

    console.log("Filtered notifications: " + notifications.length) //Notifications to REALLY return
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
            await createNotificationEntry(classMate.userId, description)
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
        description: description.description
    })
}