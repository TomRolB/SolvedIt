const express = require('express')
const router = express.Router()
const { Class, IsInClass, InviteLink} = require("../models")
const bodyParser = require("body-parser")
const NotificationSettings = require("../controllers/NotificationSettings")
const Auth = require("../controllers/Auth");
router.use(bodyParser.urlencoded({extended: true}))
const db = require("../models/index")
const sequelize = require("sequelize");
const Tags = require("../controllers/Tags");
const {Sequelize, QueryTypes} = require("sequelize");
router.post("/create-class", async (req, res) => {
    const classInfo = req.body
    // console.log(classInfo.uuid)
    const userId = await Auth.getUserId(classInfo.uuid).id
    await Class.create({name: classInfo.name, description: classInfo.description})
    const maxId = await Class.max('id');
    await console.log(maxId)
    await IsInClass.create({userId: userId, classId: maxId, permissions: 'owner', isTeacher: false})
    await NotificationSettings.createNotificationSettings(userId, maxId)
    InviteLink.create({classId: maxId, link: `http://localhost:3000/enroll-to/${maxId}`,userCount:0})
    res.send("Created class!")
})

router.get("/byId/:id", async (req, res) => {
    const id = req.params.id
    const foundClass = await Class.findByPk(id)
    res.json(foundClass)
})

router.delete("/byId/:id/edit", async (req, res) => {
    // Block this route for non-admin users
    if (!await Auth.isAdmin(req.query.uuid, req.params.id)) return

    const id = req.params.id
    await Class.destroy({where: {id: id}})
    res.json({message: "Class deleted"})
})

router.put("/byId/:id/edit", async (req, res) => {
    // Block this route for non-admin users
    if (!await Auth.isAdmin(req.body.uuid, req.params.id)) return

    const classInfo = req.body
    const id = req.params.id
    console.log(id)
    await Class.update({name: classInfo.name, description: classInfo.description}, {where: {id: id}})
    res.json({message: "Class updated"})
})

router.post('/byId/:id/create-tag', async (req, res) => {
    const tagInfo = req.body
    // const userId = await Auth.getUserId(tagInfo.uuid).id
    console.log(tagInfo)
    const result = await Tags.addTag(tagInfo.name, tagInfo.classId)
    res.send(result)
})

router.get("/byId/:id/post-question", async (req, res) => {
    const classId = req.params.id
    const result = await Tags.getTagsOfClass(classId)
    res.json(result)
})

router.post("/:uuid/enroll-to/:id", async(req,res) =>{
    // Block this route for non-admin users
    // if (!await Auth.isAdmin(req.params.uuid, req.params.id)) return

    const classId = req.params.id
    const userId = Auth.getUserId(req.params.uuid).id
    const [entry, created] = await IsInClass.findOrCreate({where:{userId: userId, classId: Number(classId), permissions: "normal", isTeacher: false}});
    if(!created)
    await NotificationSettings.createNotificationSettings(userId, classId)
    InviteLink.update({userCount: Sequelize.literal('userCount + 1')}, {where: {classId: classId}});
    res.json({message: "Successfully enrolled"})
})

router.get("/:uuid/enrolled-in/:id", async(req,res) =>{
    const classId = req.params.id
    const userId = Auth.getUserId(req.params.uuid).id
    const isInClass = await IsInClass.findOne({where:{classId: Number(classId), userId: userId}})
    res.send(isInClass)
})

router.get("/byId/:id/members", async(req,res) =>{
    const id = req.params.id
    let idString = id.toString()
    let query = `SELECT u.id, firstName, lastName, email, password, u.createdAt, u.updatedAt, permissions, isTeacher
from users u
JOIN isinclasses isin WHERE isin.userId = u.id AND isin.classId = ${idString}`
    const classMembers = await db.sequelize.query(query, {type: QueryTypes.SELECT})
    res.send(classMembers)
})

router.post("/byId/:id/kick-user/:userId", async(req,res) =>{
    const classId = req.params.id
    const userId = req.params.userId
    console.log(userId)
    await IsInClass.destroy({
        where:{
            userId: userId,
            classId: classId
        }
    })
    res.send("User successfully kicked")
})
module.exports = router