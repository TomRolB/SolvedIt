const express = require('express')
const router = express.Router()
const Auth = require('../controllers/Auth')
const {IsInClass, Votes} = require('../models/')
const Tags = require("../controllers/Tags");
const Filter = require("../controllers/Filter");
const Question = require("../controllers/Questions");
router.get('/filter-by-tags', async (req, res) => {
    const classId = req.query.classId
    const questions = await Question.getQuestionsOfClass(classId)
    if (!Array.isArray(questions) || !questions.length) return
    const result = await Filter.getSelectedQuestionsOfClass(classId, req.query.tags, req.query.showDeleted)
    res.json(result)
})

module.exports = router
