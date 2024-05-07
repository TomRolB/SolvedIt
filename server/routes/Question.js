const express = require('express')
const router = express.Router()
const Auth = require('../controllers/Auth')
const {IsInClass} = require('../models/')
const Questions = require('../controllers/Questions.js')

router.get("/questions", async (req, res) => {
    console.log("hit questions")
    console.log(`got uuid ${req.query.uuid}`)

    const classId = req.query.classId
    const userId = Auth.getUserId(req.query.uuid).id
    const isInClass = await IsInClass.findOne({where:{classId: classId, userId: userId}})

    if (!isInClass) return

    const result = await Questions.getQuestionsOfClass(classId)
    res.send(result)
})

router.post('/question', async (req, res) => {
    const classId = req.params.classId
    const userId = Auth.getUserId(req.params.uuid).id
    const isInClass = await IsInClass.findOne({where:{classId: classId, userId: userId}})

    if (!isInClass) return

    const result = await Questions.addQuestion(classId, req.params.title, req.params.description)
    res.send(result)
})

module.exports = router
