const express = require('express')
const router = express.Router()
const { Users } = require("../models")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const Auth = require("../controllers/Auth");
const fs = require("fs");
const {upload} = require("../services/FileService");
const ProfilePictureProvider = require("../providers/ProfilePictureProvider");

router.use(bodyParser.urlencoded({extended: true}))

// TODO: uninstall cookieParser and session if it's not used in the end
router.use(cookieParser())
router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "some secret", //TODO: change
    cookie: {
        httpOnly: true,
        maxAge: 3600000
    }
}))

router.get("/", async (req, res) => {
    const listOfUsers = await Users.findAll()
    res.json(listOfUsers)
})

router.post("/", async (req, res) => {
    const user = req.body
    await Users.create(user)
    res.json(user)
})

router.post("/login", async (req, res) => {
    const result = await Auth.validateUser(req)

    res.send(result)
})

router.post("/register", async (req, res) => {
    const result = await Auth.registerUser(req)

    res.send(result)
})

router.post("/isLoggedIn", async (req, res) => {
    res.send({"isLoggedIn": Auth.isLoggedIn(req.body.uuid)})
})

router.get("/is-admin", async (req, res) => {
    const result = await Auth.isAdmin(req.query.uuid, req.query.classId)
    res.send(result)
})

router.post("/logout", async (req, res) => {
    Auth.logout(req.body.uuid)
    res.send("Logged out successfully")
})

router.get("/:uuid", async(req,res) =>{
    let id = Auth.getUserId(req.params.uuid).id
    let data = await Users.findOne({where:{id:id}})
    res.send(data)
})

router.get("/:uuid/picture", async (req, res) => {
    let id = req.query.isTransientUuid
        ? Auth.popTransientUuid(req.params.uuid)
        : Auth.getUserId(req.params.uuid)?.id

    let filePath = ProfilePictureProvider.getPicturePath(res,id)
    if(!filePath) return
    res.sendFile(filePath)
})

function deleteOldPhoto(id) {
    if (fs.existsSync(`./uploads/p${id}`)) {
        const fileName = fs.readdirSync(`./uploads/p${id}`)[0]
        fs.rmSync(`./uploads/p${id}/${fileName}`)
    }
}

function relocateNewPhoto(id) {
    const fileName = fs.readdirSync(`./uploads/awaiting_id`)[0]
    console.log(`fileName: ${fileName}`)

    if (!fs.existsSync(`./uploads/p${id}`)) {
        fs.mkdirSync(`./uploads/p${id}`)
    }
    fs.renameSync(`./uploads/awaiting_id/${fileName}`, `./uploads/p${id}/${fileName}`)
}

router.post("/:uuid/picture", upload.single('file'), async (req, res) => {
    let id = Auth.getUserId(req.params.uuid)?.id
    if (id === undefined) return;

    // if (fs.existsSync(`./uploads/p${id}`)) {
    //     fs.rmdirSync(`./uploads/p${id}`, {recursive: true, force: true})
    // }
    //
    // await fs.rename('./uploads/awaiting_id', `./uploads/p${id}`, (err) => {console.log(err)})

    deleteOldPhoto(id);
    relocateNewPhoto(id);

    res.send("Uploaded file")
})

router.post("/:uuid/delete", async (req,res)=>{
    let id = Auth.getUserId(req.params.uuid).id
    Auth.logout(req.params.uuid)
    await Users.destroy({where:{id:id}})
    res.send('User has been successfully deleted')
})

router.put("/:uuid/update", async(req,res)=>{
    let id = Auth.getUserId(req.params.uuid).id
    let data = req.body
    let newFirstName = data.firstName
    let newLastName = data.lastName
    await Users.update({firstName: newFirstName, lastName: newLastName}, {where: {id:id}})
})

module.exports = router