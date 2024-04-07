const express = require('express')
const app = express()

const bodyParser = require("body-parser")
app.use(bodyParser.json())

const ejs = require('ejs') // TODO: Replace ejs by React. Delete dependency.
const db = require('./models')

app.use(express.json())

app.set('view engine', 'ejs');


// Routers
const userRouter = require('./routes/Users')
const classRouter = require('./routes/Class')
app.use("/users", userRouter)
app.use("/create-class", classRouter)

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001")
    })
})
