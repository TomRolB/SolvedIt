const express = require("express")
const router = express.Router()
const InviteController = require("../controllers/Invite")
const Auth = require("../controllers/Auth")

router.post("/one-time", async (req, res) => {
    if (!await Auth.isAdmin(req.body.uuid, req.body.classId)) return
    const result = await InviteController.createOneTimeCodeIfValid(req.body.classId, req.body.email)
    res.send(result)
})

router.post("/many-times", async (req, res) => {
    if (!await Auth.isAdmin(req.body.uuid, req.body.classId)) return
    const result = await InviteController.createManyTimesCodeIfValid(req.body.classId, req.body.expiration)
    res.send(result)
})

router.post("/join-with-code", async (req, res) => {
    const result = await InviteController.joinWithCode(req.body.code, req.body.uuid)
    res.send(result)
})

router.get("/getCodes", async (req, res) => {
    if (!await Auth.isAdmin(req.query.uuid, req.query.classId)) return
    const result = await InviteController.getCodes(req.query.classId)
    res.send(result)
})

module.exports = router