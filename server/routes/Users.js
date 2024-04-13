const express = require('express')
const router = express.Router()
const { Users } = require("../models")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const Auth = require("../controllers/Auth");

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

router.get("/login", async (req, res) => {
    // res.render("temp_login")
})

router.post("/login", async (req, res) => {
    // Get uuid, or null if user has no session
    const uuid = await Auth.validateUser(req)

    // For now, we'll send a null uuid when there is no
    // session, but this will probably be changed
    res.send(uuid)
})

router.get("/register", async (req, res) => {
    res.render("temp_register")
})

router.post("/register", async (req, res) => {
    const userIsValid = await Auth.registerUser(req)

    if (userIsValid) {
        res.send("You have successfully registered!")
    } else {
        res.send("Invalid credentials") // We will actually re-send the form, but let's keep it simple for now
    }
})

module.exports = router