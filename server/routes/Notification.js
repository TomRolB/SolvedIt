const express = require('express')
const router = express.Router()
const Auth = require("../controllers/Auth")
const NotificationSettings = require("../controllers/NotificationSettings")
const NotificationController= require('../controllers/NotificationController')
const {Notification} = require('../models/');
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
    const description = req.body
    console.log("Desc: " + description);
    await NotificationController.createNotification(description)
    res.send({message: 'Notification sent successfully!'})
})

router.get("/get-all-notifications/:uuid", async (req, res) =>{
    console.log("uuid: " + req.params.uuid);
    const userId = Auth.getUserId(req.params.uuid).id
    const allNotifications = await NotificationController.getAllNotifications(userId)
    res.send(allNotifications)
})

router.post("/:id/mark-as-seen", async (req, res) => {
    const notificationId = req.params.id
    await Notification.update({wasSeen: true},{where: {id:notificationId}})
    res.send("Notification seen successfully!")
})

module.exports = router