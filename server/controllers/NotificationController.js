const {Notification, IsInClass, NotificationSettings} = require('../models/')
const Auth = require("./Auth");

async function canBeShown(notification, userId) {
    let classSettings = await NotificationSettings.findOne({where: {userId: userId, classId: notification.classId}})
    let isTeacher = await IsInClass.findOne({where: {userId: userId, classId: notification.classId}}).isTeacher
    const notificationTypeCanBeShown = (notificationType, classSettings)=> {
        console.log("notif type: " + notificationType);

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
        return notificationTypeCanBeShown(notification.notificationType, classSettings) && classSettings.isActive
    }
    let able = isAble(notification, classSettings)
    console.log(able);
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
    console.log("All notifications: " + notifications.length);
    console.log(notifications[0].props);

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