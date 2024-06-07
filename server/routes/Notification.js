const express = require('express')
const router = express.Router()
const Auth = require("../controllers/Auth")
const NotificationSettings = require("../controllers/NotificationSettings")
const NotificationController= require('../controllers/NotificationController')

router.get("/get-general-notification-settings", async (req, res) => {
    const uuid = await Auth.getUserId(req.query.uuid)
    const settings = await NotificationSettings.getNotificationSettingsOfClass(null, uuid.id)
    res.json(settings)
})

router.get("/get-notification-settings-of-class/:classId", async (req, res) => {
    const info = req.query
    console.log(req)
    console.log(req.params)
    const userId = await Auth.getUserId(info.uuid).id
    const settings = await NotificationSettings.getNotificationSettingsOfClass(req.params.classId, userId)
    res.json(settings)
})

router.post("/update-general-notification-settings", async (req, res) => {
    const info = req.body
    const userId = await Auth.getUserId(info.uuid).id
    await NotificationSettings.updateNotificationSettings(null, userId, info, true)
    res.json("Settings updated")
})

router.post("/update-notification-settings-of-class/:classId", async (req, res) => {
    const info = req.body
    const userId = await Auth.getUserId(info.uuid).id
    await NotificationSettings.updateNotificationSettings(req.params.classId, userId, info, info.isActive)
    res.json("Settings updated")
})

router.post("/notify", async (req, res) => {
    const settings = req.body
    await NotificationController.createNotification(settings)
    res.send({message: 'Notification sent successfully!'})
})

router.get("/getAllNotifications/:uuid", async (req, res) =>{
    const userId = Auth.getUserId(req.params.uuid).id
    const allNotifications = await NotificationController.getAllNotifications(userId)
    console.log(allNotifications);
    res.send(allNotifications)
})

module.exports = router