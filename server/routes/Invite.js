const express = require("express")
const router = express.Router()
const InviteController = require("../controllers/Invite")

router.post("/one-time", async (req, res) => {
    const result = await InviteController.createOneTimeCodeIfValid(req.body.classId, req.body.email)
    res.send(result)
})

module.exports = router