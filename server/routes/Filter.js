const express = require('express')
const router = express.Router()
const Auth = require('../controllers/Auth')
const {IsInClass, Votes} = require('../models/')
const Tags = require("../controllers/Tags");
const Filter = require("../controllers/Filter");
const Question = require("../controllers/Questions");
router.get('/filter-by-tags', async (req, res) => {
    const classId = req.query.classId
    console.log(classId)
    const userId = Auth.getUserId(req.query.uuid).id
    const isAdmin = (await Auth.isAdmin(req.query.uuid, classId)).isAdmin
    const questions = await Question.getQuestionsOfClass(classId)
    if (!Array.isArray(questions) || !questions.length) return
    const result = await Filter.getSelectedQuestionsOfClass(classId, req.query.tags, req.query.showDeleted, userId, isAdmin)
    res.json(result)
})

module.exports = router
