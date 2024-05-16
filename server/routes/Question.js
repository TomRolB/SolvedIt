const express = require('express')
const router = express.Router()
const Auth = require('../controllers/Auth')
const {IsInClass} = require('../models/')
const Questions = require('../controllers/Questions.js')
router.get("/questions", async (req, res) => {
    const classId = req.query.classId
    const userId = Auth.getUserId(req.query.uuid).id
    const isInClass = await IsInClass.findOne({where:{classId: classId, userId: userId}})

    if (!isInClass) return

    const result = await Questions.getQuestionsWithTags(classId)
    res.send(result)
})

router.post('/post-question', async (req, res) => {
    const classId = req.body.classId
    const userId = Auth.getUserId(req.body.uuid).id
    const isInClass = await IsInClass.findOne({where:{classId: classId, userId: userId}})

    if (!isInClass) return

    const result = await Questions.addQuestion(classId, req.body.title, req.body.description, req.body.tags)
    res.send(result)
})

module.exports = router
