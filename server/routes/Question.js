const express = require('express')
const router = express.Router()
const Auth = require('../controllers/Auth')
const {IsInClass} = require('../models/')
const Questions = require('../controllers/Questions.js')
const VoteController = require('../controllers/VoteController.js')

const multer  = require('multer')


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
        req.body.classId
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.originalname + '.' +extension)
    }
})
const upload = multer({ storage: storage })

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
    console.log('POST BODY')
    console.log(req.body)
    res.send("Did nothing")
})

router.post('/image', upload.single('file'), async (req, res) => {
    console.log('REQ')
    console.log(req)
    console.log('BODY')
    console.log(req.body)

    const classId = Number(req.body.classId)
    const userId = Auth.getUserId(req.body.uuid).id
    const isInClass = await IsInClass.findOne({
        where: {
            classId: classId,
            userId: userId
        }
    })

    if (!isInClass) return

    const result = await Questions.addQuestion(
        userId,
        classId,
        req.body.title,
        req.body.description,
        // Have to parse it, since in this particular case we use formData
        req.body.tags === 'null'? null : req.body.tags.split(',').map(Number)
    )
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

router.get("/reported-questions", async (req, res) => {
    console.log(req)
    const classId = req.query.classId
    console.log(classId)
    const reportedQuestions = await Questions.getReportedQuestions(classId)
    console.log(reportedQuestions)
    res.send(reportedQuestions)
})

router.get("/reported-answers", async (req, res) => {
    console.log(req)
    const classId = req.query.classId
    console.log(classId)
    const reportedQuestions = await Questions.getReportedAnswers(classId)
    console.log(reportedQuestions)
    res.send(reportedQuestions)
})

module.exports = router
