const {Notification, IsInClass} = require('../models/')
const NotificationSettings = require("./NotificationSettings")
const Auth = require("./Auth");

async function canBeShown(notification, userId) {
    let classSettings = await NotificationSettings.getNotificationSettingsOfClass(notification.classId, userId)
    let generalSettings = await NotificationSettings.getNotificationSettingsOfClass(null, userId)
    let isTeacher = await IsInClass.findOne({where: {userId: userId, classId: notification.classId}}).isTeacher
    console.log("User id: " + userId);
    const notificationTypeCanBeShown = (notificationType, classSettings)=> {

        switch (notificationType){
            case "newQuestion":
                return classSettings.newQuestions === "All"
            case "newAnswer":
                return classSettings.newAnswers === "All"
            case "answerValidation":
                return isTeacher ? classSettings.answerValidation === "Teacher" : classSettings.answerValidation === "Always"
        }
    }
    const isAble = (notification, classSettings) =>{
        if(classSettings.isActive){
            return notificationTypeCanBeShown(notification.notificationType, classSettings)
        }
        return notificationTypeCanBeShown(notification.notificationType, generalSettings)
    }
    let able = isAble(notification, classSettings)
    console.log("Is able to be shown: " + able);
    return able;
}

exports.getAllNotifications = async (userId) => {
    let classes = await IsInClass.findAll({where: {userId: userId}})
    let notifications = []
    for(let cl of classes){
        let notification = await Notification.findOne({where: {classId: cl.id}})
        if(!notification) continue
        notifications.push(notification)
    }

    let filtered = [];

    for (let notification of notifications) {
        if (await canBeShown(notification, userId)) {
            filtered.push(notification);
        }
    }
    console.log("Filtered notifications: " + filtered.length)
    return filtered;
}


exports.createNotification = async (settings) =>{
    const userId = Auth.getUserId(settings.uuid).id
    await Notification.create({userId: userId,
        classId: settings.classId,
        title: settings.title,
        notificationType: settings.notificationType,
        description: settings.description})
}