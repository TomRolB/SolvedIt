const {Notification} = require('../models/')
const Auth = require("./Auth");

exports.getAllNotifications = async (userId) =>{
    return await Notification.findAll({where: {userId: userId}})
}

exports.createNotification = async (settings) =>{
    const userId = Auth.getUserId(settings.uuid).id
    await Notification.create({userId: userId,
        classId: settings.classId,
        title: settings.title,
        notificationType: settings.notificationType,
        description: settings.description})
}