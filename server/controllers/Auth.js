const { Users, IsInClass, NotificationSettings } = require("../models")
const crypto = require("crypto")
const cron = require("cron")

const sessions = {}
const EXPIRATION_TIME = 3600000

// Node class used in SessionQueue
class Node {
    constructor(value){
        this.value = value
        this.datetime = Date.now()
        this.next = null
    }
}

// Stores uuid in a FIFO manner, so that
// we can efficiently delete sessions which
// have expired
class SessionQueue {
    constructor(){
        this.first = null
        this.last = null
        this.size = 0
    }

    enqueue(value){
        let newNode = new Node(value)
        if(!this.first){
            this.first = newNode
            this.last = newNode
        }else{
            this.last.next = newNode
            this.last = newNode
        }

        this.size++

        return this.size
    }
    deleteAllExpiredSessions() {
        const now = Date.now()
        while (this.size > 0 && (now - this.first.datetime > EXPIRATION_TIME)) {
            delete sessions[this.first.value]
            this.first = this.first.next
            this.size--
        }
    }
}

const queue = new SessionQueue()

// Cron job to delete expired sessions.
// The job will run every minute to make it testable
new cron.CronJob(
    '00 * * * * *',
    function () {
        queue.deleteAllExpiredSessions()
        console.log("CRON JOB: Deleted expired sessions")
    },
    null,
    true,
    "America/Argentina/Buenos_Aires"
);

exports.validateUser = async (form) => {
    const formEmail = form.body.email
    const formPassword = form.body.password

    const user = await Users.findOne({
        where: {
            email: formEmail
        }
    })

    if (user === null || user.dataValues.password !== formPassword) return {
        wasSuccessful: false,
        errorMessage: "The provided email or password are invalid",
    }

    //TODO: Handle user trying to login when already having a session

    const uuid = crypto.randomUUID()
    sessions[uuid] = {
        id: user.id,
        since: Date.now()
    }
    queue.enqueue(uuid)

    return {
        wasSuccessful: true,
        uuid: uuid,
    }
}

const RegisterResult = {
    SUCCESS: "Successfully registered",
}

exports.registerUser = async (form) => {
    if (form.body.password !== form.body.confirmPassword) {
        return {
            wasSuccessful: false,
            errorMessage: "Passwords do not match",
        }
    }

    const formEmail = form.body.email
    const dbUser = await Users.findOne({
        where: {
            email: formEmail
        }
    })

    if (dbUser !== null) return {
        wasSuccessful: false,
        errorMessage: "This email has already been used",
    }

    const user = await Users.build({
        firstName: form.body.firstName,
        lastName: form.body.lastName,
        email: form.body.email,
        password: form.body.password
    }).save()

    await NotificationSettings.build({
        userId: user.id,
        classId: null,
        newQuestions: "None",
        newAnswers: "None",
        answerValidation: "Never",
        notifyByEmail: false,
        isActive: true
    }).save()

    const uuid = crypto.randomUUID()
    sessions[uuid] = {
        id: user.id,
        since: Date.now()
    }
    queue.enqueue(uuid)

    return {
        wasSuccessful: true,
        uuid: uuid
    }
}

exports.isLoggedIn = (uuid) => {
    return uuid in sessions
}

exports.logout = (uuid) => {
    delete sessions[uuid]
}

exports.getUserId = (uuid) => {
    console.log(sessions)
    return sessions[uuid]
}

exports.isAdmin = async (uuid, classId) => {
    const userId = this.getUserId(uuid).id

    const dbUserInClass = await IsInClass.findOne({
        where: {
            userId: userId,
            classId: classId
        }
    })
    if(!dbUserInClass) return {isAdmin: false};
    return {isAdmin: dbUserInClass.permissions !== "normal"}
}