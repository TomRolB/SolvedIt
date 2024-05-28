const express = require('express')
const router = express.Router()
const Auth = require("../controllers/Auth")
const NotificationSettings = require("../controllers/NotificationSettings")

router.get("/get-general-notification-settings", async (req, res) => {
    const uuid = await Auth.getUserId(req.query.uuid)
    const settings = await NotificationSettings.getNotificationSettingsOfClass(null, uuid.id)
    res.json(settings)
})

router.get("/get-notification-settings-of-class/:classId", async (req, res) => {
    const info = req.query
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

module.exports = router