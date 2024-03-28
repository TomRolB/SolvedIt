const express = require('express')
const router = express.Router()
const { Users } = require("../models")
const bodyParser = require("body-parser")
const Auth = require("../controllers/Auth");
router.use(bodyParser.urlencoded({extended: true}))

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
    res.render("temp_login")
})

router.post("/login", async (req, res) => {
    const userIsValid = await Auth.validateUser(req)

    if (userIsValid) {
        res.send("You have successfully logged in!")
    } else {
        res.send("Invalid credentials")
    }
})

module.exports = router