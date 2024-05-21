const express = require('express')
const app = express()

const cors = require('cors')

const bodyParser = require("body-parser")
app.use(bodyParser.json())

const ejs = require('ejs') // TODO: Replace ejs by React. Delete dependency.
const db = require('./models')

app.use(express.json())

//Cors set
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.set('view engine', 'ejs');


// Routers
const userRouter = require('./routes/Users')
const classRouter = require('./routes/Class')
const homeRouter = require('./routes/Home')
const inviteRouter = require('./routes/Invite')
const questionRouter = require('./routes/Question.js')
const tagRouter = require('./routes/Tags.js')
const voteRouter = require('./routes/VoteRoutes')
app.use("/users", userRouter)
app.use("/class", classRouter)
app.use("/home", homeRouter)
app.use("/invite", inviteRouter)
app.use("/question", questionRouter)
app.use("/tag", tagRouter)
app.use("/votes", voteRouter)


db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001")
    })
})
