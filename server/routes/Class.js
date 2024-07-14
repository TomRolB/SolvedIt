const express = require('express')
const router = express.Router()
const { Class, IsInClass, InviteLink, DiscordChannelLink} = require("../models")
const bodyParser = require("body-parser")
const NotificationSettings = require("../controllers/NotificationSettings")
const Auth = require("../controllers/Auth");
router.use(bodyParser.urlencoded({extended: true}))
const db = require("../models/index")
const Tags = require("../controllers/Tags");
const DiscordChannelController = require('../controllers/DiscordChannelController')
const {generateTransientUuid} = require("../controllers/Auth");
const ClassController = require("../controllers/ClassController");

router.post("/create-class", async (req, res) => {
    const classInfo = req.body
    // console.log(classInfo.uuid)
    const userId = await Auth.getUserId(classInfo.uuid).id
    await Class.create({name: classInfo.name, description: classInfo.description})
    const maxId = await Class.max('id');
    // await console.log(maxId)
    await IsInClass.create({userId: userId, classId: maxId, permissions: 'owner', isTeacher: false})
    await NotificationSettings.createNotificationSettings(userId, maxId)
    await InviteLink.create({classId: maxId, link: `http://localhost:3000/enroll-to/${maxId}`,userCount:0, isActive: true})
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
    // console.log(id)
    await Class.update({name: classInfo.name, description: classInfo.description}, {where: {id: id}})
    res.json({message: "Class updated"})
})

router.post('/byId/:id/create-tag', async (req, res) => {
    const tagInfo = req.body
    // const userId = await Auth.getUserId(tagInfo.uuid).id
    // console.log(tagInfo)
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
    const enrolled = await ClassController.enrollTo(userId, classId)
    res.json(enrolled)
})

router.get("/:uuid/enrolled-in/:id", async(req,res) =>{
    const classId = req.params.id
    const userId = Auth.getUserId(req.params.uuid).id
    // console.log("USER ID: ",userId);
    // console.log(typeof(userId));
    const isInClass = await IsInClass.findOne({where:{classId: Number(classId), userId: userId}})
    if(!isInClass) {
        res.send([])
        return
    }
    res.json(isInClass)
})

router.get("/byId/:id/get-link", async(req,res) =>{
    const classId = req.params.id
    const inviteLink = await InviteLink.findOne({where:{classId:Number(classId)}})
    res.json(inviteLink)
})

router.post("/byId/:id/change-link-activity", async(req,res) =>{
    const classId = req.params.id
    let inviteLink = await InviteLink.findOne({where:{classId:Number(classId)}})
    await InviteLink.update({isActive: !inviteLink.isActive},{where:{classId:Number(classId)}});

    inviteLink = await InviteLink.findOne({where:{id:classId}})

    res.send(inviteLink)
})




router.get("/byId/:id/members", async(req,res) =>{
    const id = req.params.id
    let query = `SELECT u.id, firstName, lastName, email, password, u.createdAt, u.updatedAt, permissions, isTeacher
from users u
JOIN isinclasses isin WHERE isin.userId = u.id AND isin.classId = :id`
    const classMembers = await db.sequelize.query(query, {replacements: {id: id},type: QueryTypes.SELECT})
    const membersWithPictures = []
    for(let user of classMembers){
        membersWithPictures.push({userInfo: user, uuid: generateTransientUuid(user.id)})
    }
    res.send(membersWithPictures)
})


router.post("/byId/:id/kick-user/:userId", async(req,res) =>{
    const classId = req.params.id
    const userId = req.params.userId
    // console.log(userId)
    await IsInClass.destroy({
        where:{
            userId: userId,
            classId: classId
        }
    })
    res.send("User successfully kicked")
})

router.get("/byId/:id/leaderboard", async(req,res) =>{
    const id = req.params.id
    console.log("Id: " + id);
    let query = `SELECT u.id, u.firstName, u.lastName, u.createdAt, u.updatedAt, u.email, count(a.userId) as upvotes
from users u
JOIN isinclasses isin ON isin.userId = u.id AND isin.classId = :id
JOIN answers a ON a.userId = u.id AND a.classId = isin.classId
JOIN votes v ON v.answerId = a.id
GROUP BY u.id
ORDER BY upvotes desc`;

    const leaderBoard = await db.sequelize.query(query, {replacements: {id: id},type: QueryTypes.SELECT}) //Shoud be an array
    const leaderBoardWithPictures = []
    for(let user of leaderBoard){
        leaderBoardWithPictures.push({userInfo: user, uuid: generateTransientUuid(user.id)})
    }
    res.send(leaderBoardWithPictures)
})

router.put("/byId/:id/change-permissions", async(req,res) =>{
    const classId = req.params.id
    const userId = req.body.userId
    const newPermission = req.body.permissions
    const isTeacher = req.body.isTeacher
    await IsInClass.update({permissions: newPermission, isTeacher: isTeacher}, {where: {userId: userId, classId: classId}})
    res.send("Role successfully changed")
})

router.post("/byId/:id/discord/link-with-channel/:channel_id", async(req, res) =>{
    try{
        const classId = req.params.id
        const classObject = await Class.findOne({where: {id: classId}})
        const isLinked = await DiscordChannelController.classIsLinked(req)
        if(isLinked){
            res.send("Channel already linked")
            return;
        }

        console.log(`Creating link for ${req.params.channel_id}`)

        await DiscordChannelLink.create({classId: classId, channelId: req.params.channel_id, name: classObject.name})

        res.send("Channel linked successfully!")
    } catch (err){
        console.log(err);
    }
})

router.get("/byId/:id/discord/is-linked", async(req,res) =>{
    const exists = await DiscordChannelController.classIsLinked(req)
    res.send(exists)
})


module.exports = router