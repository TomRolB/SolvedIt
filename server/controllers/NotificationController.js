const {Notification} = require('../models/')
const Auth = require("./Auth");

exports.getAllNotifications = async (userId) =>{
    //Can make it cleaner
    let nots;
    nots = await Notification.findAll({where: {userId: userId}})
    console.log(nots);
    return nots
    // return await Notification.findAll()

}

exports.createNotification = async (settings) =>{
    const userId = Auth.getUserId(settings.uuid).id
    await Notification.create({userId: userId,
        classId: settings.classId,
        title: settings.title,
        notificationType: settings.notificationType,
        description: settings.description})
}