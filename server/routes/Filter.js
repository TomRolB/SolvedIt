const express = require('express')
const router = express.Router()
const Auth = require('../controllers/Auth')
const {IsInClass, Votes} = require('../models/')
const Tags = require("../controllers/Tags");
const Filter = require("../controllers/Filter");
router.get('/filter-by-tags', async (req, res) => {
    console.log(req)
    const classId = req.query.classId
    // const userId = Auth.getUserId(req.body.uuid).id
    const result = await Filter.getSelectedQuestionsOfClass(classId, req.query.tags, req.query.hidden)
    res.json(result)
})

module.exports = router
