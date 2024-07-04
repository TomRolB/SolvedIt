const express = require('express')
const router = express.Router()
const Auth = require('../controllers/Auth')
const {IsInClass, Votes} = require('../models/')
const VoteController = require('../controllers/VoteController.js')
router.post('/upvote', async (req, res) => {
    const classId = req.body.classId
    const userId = Auth.getUserId(req.body.uuid).id
    const isInClass = await IsInClass.findOne({
        where: {
            classId: classId,
            userId: userId
        }
    })

    if (!isInClass) return

    if (!req.body.undoingVote) await VoteController.upVote(userId, req.body.answerId)
    else await VoteController.undoVote(userId, req.body.answerId)


    res.send("Upvoted question")
})

module.exports = router
