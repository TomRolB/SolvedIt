const {Notification, IsInClass} = require('../models/')
const NotificationSettings = require("./NotificationSettings")
const EtherealMailService = require('../services/EtherealMailService')


const emailServices = [EtherealMailService]

async function userCanBeNotified(notification, userId) {
    let classSettings = await NotificationSettings.getNotificationSettingsOfClass(notification.classId, userId)
    let generalSettings = await NotificationSettings.getNotificationSettingsOfClass(null, userId)
    let isTeacher = await IsInClass.findOne({where: {userId: userId, classId: notification.classId}}).isTeacher
    console.log("User id: " + userId);
    const notificationTypeCanBeShown = (notificationType, classSettings)=> {
        console.log("Notification type" + notificationType);
        switch (notificationType){
            case "newQuestion":
                return {canBeShown: classSettings.newQuestions === "All", byEmail: classSettings.notifyByEmail}
            case "newAnswer":
                return {canBeShown: classSettings.newAnswers === "All", byEmail: classSettings.notifyByEmail}
            case "answerValidation":
                return isTeacher
                    ? {canBeShown: classSettings.answerValidation === "Teacher", byEmail: classSettings.notifyByEmail}
                    : {canBeShown: classSettings.answerValidation === "Always", byEmail: classSettings.notifyByEmail}
        }
    }
    const isAble = (notification, classSettings) =>{
        if(classSettings.isActive){
            return notificationTypeCanBeShown(notification.notificationType, classSettings)
        }
        return notificationTypeCanBeShown(notification.notificationType, generalSettings)
    }
    let able = isAble(notification, classSettings)
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
    const classMates = await IsInClass.findAll({where: {classId: description.classId}})
    for (let classMate of classMates){
        const canBeNotified = await userCanBeNotified(description, classMate.userId);
        if (canBeNotified.canBeShown) {
            await createNotificationEntry(classMate.userId, description)
            console.log(`Should send by email: ${canBeNotified.byEmail}`)
            if (canBeNotified.byEmail) {
                emailServices.forEach((service) => {
                    service.sendEmail(description)
                })
            }
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