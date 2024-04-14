const express = require('express')
const router = express.Router()
const { Class, Users, IsInClass } = require("../models")

router.get("/", async (req, res) => {
    const listOfClasses = await Class.findAll()
    res.json(listOfClasses)
})

router.post("/", async (req, res) => {
    const classInfo = req.body
    res.json(classInfo)
})

module.exports = router