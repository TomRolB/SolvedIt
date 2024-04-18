const express = require('express')
const router = express.Router()
const { Class, Users, IsInClass } = require("../models")
const auth = require("../controllers/Auth")
const {Sequelize, QueryTypes} = require("sequelize");
const db = require("../models/index")



router.post("/get-courses", async (req, res) => {
    let userId = null
    const uuid = req.body.uuid
    const info = await auth.getUserId(uuid)
    // for some reason this is the only working way to get the userId
    for (const a in info) {
        userId = info[a]
        break;
    }
    const listOfClasses = await db.sequelize.query(`SELECT DISTINCT classId, name, description FROM IsInClasses JOIN Classes ON IsInClasses.classId = Classes.id WHERE userId = ?`, {
        replacements: [userId == null ? 0 : userId],
        type: QueryTypes.SELECT,
    });
    res.json(listOfClasses)
})

router.post("/get-user", async (req, res) => {
    let userId = null
    const uuid = req.body.uuid
    const info = await auth.getUserId(uuid)
    // for some reason this is the only working way to get the userId
    for (const a in info) {
        userId = info[a]
        break;
    }
    if (userId == null) {
        res.json({error: "User not found"})
        return
    }
    const user = await Users.findOne({
        where: {
            id: userId
        }
    })
    res.json(user.dataValues.firstName)
})


module.exports = router