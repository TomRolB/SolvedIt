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
    const maxId = await Class.max('id');
    await console.log(maxId)
    await IsInClass.create({userId: userId, classId: maxId})
    // res.json(classInfo)
})

router.get("/byId/:id", async (req, res) => {
    const id = req.params.id
    const foundClass = await Class.findByPk(id)
    res.json(foundClass)
})

router.delete("/byId/:id/edit", async (req, res) => {
    const id = req.params.id
    await Class.destroy({where: {id: id}})
    res.json({message: "Class deleted"})
})

router.put("/byId/:id/edit", async (req, res) => {
    const classInfo = req.body
    const id = req.params.id
    console.log(id)
    await Class.update({name: classInfo.name, description: classInfo.description}, {where: {id: id}})
    res.json({message: "Class updated"})
})

router.post("/:uuid/enroll-to/:id", async(req,res) =>{
    const classId = req.params.id
    const userId = Auth.getUserId(req.params.uuid).id
    IsInClass.create({userId: userId, classId: classId})
})

module.exports = router