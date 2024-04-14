const express = require('express')
const router = express.Router()
const { Class, Users, IsInClass } = require("../models")
const auth = require("../controllers/Auth")
const {Sequelize, QueryTypes} = require("sequelize");
const db = require("../models/index")

let userId;

router.get("/", async (req, res) => {
    console.log(userId)
    const listOfClasses = await db.sequelize.query(`SELECT DISTINCT classId, name, description FROM IsInClasses JOIN Classes ON IsInClasses.classId = Classes.id WHERE userId = ?`, {
        replacements: [userId == null ? 0 : userId],
        type: QueryTypes.SELECT,
    });
    res.json(listOfClasses)
})

router.post("/", async (req, res) => {
    const uuid = req.body.uuid
    const info = await auth.getUserId(uuid)
    for (const a in info) {
        userId = info[a]
        break;
    }
})


module.exports = router