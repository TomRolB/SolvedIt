const express = require('express')
const router = express.Router()
const Auth = require('../controllers/Auth')
const {IsInClass} = require('../models/')
const Questions = require('../controllers/Questions.js')
const VoteController = require('../controllers/VoteController.js')
router.get("/questions", async (req, res) => {
    const classId = req.query.classId
    const userId = Auth.getUserId(req.query.uuid).id
    const isInClass = await IsInClass.findOne({
        where: {
            classId: classId,
            userId: userId
        }
    })

    if (!isInClass) return
    const isAdmin = (await Auth.isAdmin(req.query.uuid, classId)).isAdmin

    const result = await Questions.getQuestionsWithTags(classId, userId, isAdmin)
    res.send(result)
})

router.get("/answers", async (req, res) => {
    const classId = req.query.classId
    const questionId = req.query.questionId
    const userId = Auth.getUserId(req.query.uuid).id
    const isInClass = await IsInClass.findOne({
        where: {
            classId: classId,
            userId: userId
        }
    })

    if (!isInClass) return
    const isAdmin = (await Auth.isAdmin(req.query.uuid, classId)).isAdmin

    const result = await Questions.getAnswersToQuestion(questionId, userId, isAdmin)

    for (const answer of result) {
        answer.dataValues.voteCount = await VoteController.voteCount(answer.id);
        answer.dataValues.hasUserVotedIt = await VoteController.hasUserVoted(answer.id, userId)
    }

    res.send(result)
})

router.post('/post-question', async (req, res) => {
    const classId = req.body.classId
    const userId = Auth.getUserId(req.body.uuid).id
    const isInClass = await IsInClass.findOne({
        where: {
            classId: classId,
            userId: userId
        }
    })

    if (!isInClass) return

    const result = await Questions.addQuestion(userId, classId, req.body.title, req.body.description, req.body.tags)
    res.send(result)
})

router.post('/post-answer', async (req, res) => {
    const classId = req.body.classId
    const userId = Auth.getUserId(req.body.uuid).id
    const isInClass = await IsInClass.findOne({
        where: {
            classId: classId,
            userId: userId
        }
    })

    if (!isInClass) return

    const result = await Questions.addAnswer(
        userId,
        classId,
        req.body.questionId,
        req.body.parentId,
        req.body.description
    )
    res.send(result)
})

router.put('/report-question', async (req, res) => {
    const id = req.body.id
    const result = await Questions.reportQuestion(id)
    res.send(result)
})

router.put('/report-answer', async (req, res) => {
    const id = req.body.id
    const result = await Questions.reportAnswer(id)
    res.send(result)
})

router.delete('/answer', async (req, res) => {
    const classId = req.body.classId
    const userId = Auth.getUserId(req.body.uuid).id
    const isInClass = await IsInClass.findOne({
        where: {
            classId: classId,
            userId: userId
        }
    })

    if (!isInClass) return

    await Questions.deleteAnswer(req.body.answerId)
    res.send("Deleted answer")
})


router.delete('/question', async (req, res) => {
    const classId = req.body.classId
    const userId = Auth.getUserId(req.body.uuid).id
    const isInClass = await IsInClass.findOne({
        where: {
            classId: classId,
            userId: userId
        }
    })

    if (!isInClass) return

    await Questions.deleteQuestion(req.body.questionId)
    res.send("Deleted question")
})

module.exports = router
