const express = require("express")
const router = express.Router()
const InviteController = require("../controllers/Invite")

router.post("/one-time", async (req, res) => {
    const result = InviteController.createOneTimeCodeIfValid(req.body.classId, req.body.email, req.body.expiration)
    req.res(result)
})

module.exports = router