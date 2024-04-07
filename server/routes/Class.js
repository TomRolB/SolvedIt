const express = require('express')
const router = express.Router()
const { Class, Users} = require("../models")
const bodyParser = require("body-parser")
const Auth = require("../controllers/Auth");
router.use(bodyParser.urlencoded({extended: true}))

router.get("/", async (req, res) => {
    const listOfClasses = await Class.findAll()
    res.json(listOfClasses)
    console.log(listOfClasses)
})
router.post("/", async (req, res) => {
    const classInfo = req.body
    await Class.create(classInfo)
    res.json(classInfo)
})

module.exports = router