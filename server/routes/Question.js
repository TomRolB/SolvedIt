const express = require('express')
const router = express.Router()
const Auth = require('../controllers/Auth')
const {IsInClass} = require('../models/')
const Questions = require('../controllers/Questions.js')
const VoteController = require('../controllers/VoteController.js')

const multer  = require('multer')
const fs= require('fs');
const path = require('path');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = './uploads/awaiting_id';

        // The following validation was initially performed to avoid having files
        // located permanently at the 'awaiting_id' directory. However,
        // this broke multi-file uploading.
        // TODO: should think of how to re-introduce this validation

        // if (fs.existsSync(dir)){
        //     throw Error("There's a file which wasn't assigned an id")
        // }

        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        cb(null, dir)
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

    const result = await Questions.getQuestionsWithTags(classId, userId, isAdmin, 1)
    res.send(result)
})

router.get("/file", async (req, res) => {
    const prefix = req.query.isAnswer === "true"? "a" : ""
    const filepath = path.resolve(__dirname + `/../uploads/${prefix + req.query.id}/${req.query.fileName}`)
    res.sendFile(filepath)
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

function parsedTags(req) {
    return req.body.tags === 'null' ? null : req.body.tags.split(',').map(Number);
}

router.post('/post-question', upload.array('file', 10), async (req, res) => {
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
        parsedTags(req)
    )

    res.send("Posted question")
})

function parsedParentId(req) {
    return req.body.parentId === 'null' ? null : Number(req.body.parentId);
}

router.post('/post-answer', upload.array('file', 10), async (req, res) => {
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
        parsedParentId(req),
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

router.put('/answer/validate', async (req,res) =>{
    console.log("body: " + req.body)
    console.log("uuid: " + req.body.uuid)
    console.log("classId: " + req.body.classId)
    console.log("answerId: " + req.body.answerId)
    console.log("")
    console.log(JSON.stringify(req.body))
    const classId = req.body.classId
    const userId = Auth.getUserId(req.body.uuid).id
    const isInClass = await IsInClass.findOne({
        where: {
            classId: classId,
            userId: userId
        }
    })

    if (!isInClass) return

    let isVerified = await Questions.updateAnswerVeridity(req.body.answerId)
    res.send(isVerified)

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
