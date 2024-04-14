const express = require('express')
const router = express.Router()
const { Class, IsInClass, Users} = require("../models")
const bodyParser = require("body-parser")
const Auth = require("../controllers/Auth");
router.use(bodyParser.urlencoded({extended: true}))
const db = require("../models/index")
router.post("/create-class", async (req, res) => {
    const classInfo = req.body
    // console.log(classInfo.uuid)
    const userId = await Auth.getUserId(classInfo.uuid).id
    await Class.create({name: classInfo.name, description: classInfo.description})
    const classId = await Class.findOne({
        attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'id']]
    })
    await IsInClass.create({userId: userId, classId: classId.id})
    // res.json(classInfo)
})

module.exports = router