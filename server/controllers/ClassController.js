const { Class, IsInClass, InviteLink} = require("../models")
const NotificationSettings = require("./NotificationSettings");
const {Sequelize} = require("sequelize");

exports.isEnrolledIn = async(userId, classId)=>{
    return await IsInClass.findOne({where: {classId: classId, userId: userId}})
}

exports.getInviteLink = async(classId)=>{
    return await InviteLink.findOne({where: {classId: classId}})
}

exports.getClass = async(classId)=>{
    return await Class.findOne({where:{id: classId}})
}

exports.enrollTo = async(userId, classId)=>{
    //BETTER PRACTICE IS TO SEND ERROR MESSAGES AND DATA, NOT BOOLEANS
    console.log(classId)
    const classExists = await this.getClass(classId)
    if(!classExists) return false;

    const enrolledIn = await this.isEnrolledIn(userId, classId)
    if(enrolledIn !== null) return true;

    const inviteLink = await this.getInviteLink(classId)
    if(!inviteLink.isActive) return false;

    await IsInClass.create({userId: userId, classId: classId, permissions: "normal", isTeacher: false})
    await NotificationSettings.createNotificationSettings(userId, classId)
    await InviteLink.update({userCount: Sequelize.literal('userCount + 1')}, {where: {classId: classId}});
    return true;
}