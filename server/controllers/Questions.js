const {Question, Answer, Users, TaggedBy, DiscordMessage} = require("../models/")
const db = require("../models/index")
const {QueryTypes} = require("sequelize");
const fs = require('fs')
const {generateTransientUuid} = require("./Auth");
const axios = require("axios");
const {discord} = require("../routes/discord");

exports.getQuestionsOfClass = async (classId) => await Question.findAll({
    where: {
        classId: classId
    },
    include: Users
});

exports.getQuestionsWithTags = async (classId, userId, isAdmin, isActive) => {
    const questionsWithTags = await db.sequelize.query(`
        SELECT DISTINCT Questions.id, Questions.title, Questions.description, Questions.classId, Questions.classId, Questions.wasReported, Questions.isActive, Tags.id as tagId, Tags.name as tagName, Users.id as userId, Users.firstName as firstName, Users.lastName as lastName
        FROM Questions 
        LEFT JOIN TaggedBies ON Questions.id = TaggedBies.questionId
        LEFT JOIN Tags ON TaggedBies.tagId = Tags.id
        LEFT JOIN Users ON Questions.userId = Users.id
        WHERE Questions.classId = ? AND (isActive = ? OR isActive = 1)`, {
            replacements: [classId, isActive],
            type: QueryTypes.SELECT,
        }
    );

    questionsWithTags.forEach((question) => {
        question.canBeDeleted = question.userId === userId || isAdmin;
        question.uuid = generateTransientUuid(question.userId);
    })

    questionsWithTags.forEach((question) => {
        let path = `./uploads/${question.id}`;
        if (fs.existsSync(path)) {
            question.fileNames = fs.readdirSync(path)
        }
        else question.fileNames = []
    })

    return questionsWithTags
}

exports.getAnswersToQuestion = async (questionId, userId, isAdmin) => {
    const answers = await Answer
        .findAll({
            where: {
                questionId: questionId
            },
            include: Users
        })

    answers.forEach((answer) => {
        answer.dataValues.belongsToThisUser = answer.userId === userId;
        answer.dataValues.canBeDeleted = answer.userId === userId || isAdmin;
    })

    answers.forEach((answer) => {
        answer.dataValues.uuid = generateTransientUuid(answer.dataValues.User.id)
    })

    answers.forEach((answer) => {
        let path = `./uploads/a${answer.id}`;
        if (fs.existsSync(path)) {
            answer.dataValues.fileNames = fs.readdirSync(path)
        }
        else answer.dataValues.fileNames = []
    })

    return answers
};


exports.addQuestion = async (userId, classId, title, description, tags) => {
    const result = await Question.create({
        userId: userId,
        classId: classId,
        title: title,
        description: description,
        wasReported: false,
        isActive: true,
        isVerified: false
    })

    const userName = await Users.findOne({
        where: {
            id: userId
        },
        attributes: ['firstName', 'lastName']
    })

    function sendMessageInThread(res) {
        const threadId = res.data.id;
        axios
            .post(`https://discord.com/api/v10/channels/${threadId}/messages`,
                {
                    content: `**${userName.firstName} ${userName.lastName}**:\n\n` + description
                }, {
                    headers: {
                        Authorization: 'Bot ' + discord.DISCORD_TOKEN
                    }
                }
            )
            .then((res) => {
                DiscordMessage.create({
                    messageId: res.data.id,
                    questionOrAnswerId: result.id,
                    threadId: threadId,
                    isAnswer: false
                })
            })
            .catch(err => console.log(err))
    }

    function createThreadFromQuestion() {
        axios
            .post(`https://discord.com/api/v10/channels/1259563181848924284/threads`,
                {name: title, type: 11},
                {headers: {Authorization: 'Bot ' + discord.DISCORD_TOKEN}})
            .then(res => {
                sendMessageInThread(res);
            })
            .catch(err => console.log(err))
    }

    createThreadFromQuestion();

    fs.rename('./uploads/awaiting_id', `./uploads/${result.id}`,() => {})

    const maxId = await Question.max('id')
    if (tags === undefined || tags === null) return "Created a question"
    for (let tag of tags) {
        await TaggedBy.create({
            questionId: maxId,
            tagId: tag
        })
    }

    return "Created a question"
};

exports.addQuestionImage = async (userId, file) => {
    console.log("Writing file:")
    console.log(file)
    await fs.writeFile(`../user_files/questions/${userId}.png`, file, (err) => console.log(err))
}

exports.addAnswer = async (userId, classId, questionId, parentId, description) => {
    const result = await Answer.create({
        userId: userId,
        classId: classId,
        questionId: questionId,
        parentId: parentId,
        description: description,
        wasReported: false,
        isActive: true,
        isVerified: false
    })

    const userName = await Users.findOne({
        where: {
            id: userId
        },
        attributes: ['firstName', 'lastName']
    })

    async function sendDiscordMessage() {
        const messageBeingAnswered = await DiscordMessage.findOne(
            // If it has no parent, then the parent is not an answer, but the question per se
            parentId === null || parentId === undefined
                ? {
                    where: {
                        questionOrAnswerId: questionId,
                        isAnswer: false
                    },
                    attributes: ['messageId', 'threadId']
                } : {
                    where: {
                        questionOrAnswerId: parentId,
                        isAnswer: true
                    }
                }
        )

        if (!messageBeingAnswered) return;

        axios
            .post(`https://discord.com/api/v10/channels/${messageBeingAnswered.threadId}/messages`,
                {
                    content: `**${userName.firstName} ${userName.lastName}**:\n\n` + description,
                    message_reference: {
                        message_id: messageBeingAnswered.messageId
                    }
                }, {
                    headers: {
                        Authorization: 'Bot ' + discord.DISCORD_TOKEN
                    }
                }
            )
            .then(async res => {
                await DiscordMessage.create({
                    messageId: res.data.id,
                    questionOrAnswerId: result.id,
                    threadId: messageBeingAnswered.threadId,
                    isAnswer: true
                })

            })
            .catch(err => console.log(err))
    }

    await sendDiscordMessage()

    fs.rename('./uploads/awaiting_id', `./uploads/a${result.id}`,() => {})

    return "Created an answer"
};


exports.reportQuestion = async (questionId) => {
    let answer = await Question.findOne({ where: { id : questionId } })
    await Question.update({wasReported: answer.wasReported + 1}, {where: {id: questionId}})
    return "Question reported"
}

exports.reportAnswer = async (answerId) => {
    let answer = await Answer.findOne({ where: { id : answerId } })
    await Answer.update({wasReported: answer.wasReported + 1}, {where: {id: answerId}})
    return "Answer reported"
}

exports.deleteAnswer = async (answerId) => {
    const entry = await Answer.findOne({
        where: {
            id: answerId
        }
    })

    await entry.update({
        isActive: false
    })

    await entry.save()
}

exports.deleteQuestion = async (questionId) => {
    const entry = await Question.findOne({
        where: {
            id: questionId
        }
    })

    await entry.update({
        isActive: false
    })

    await entry.save()
}
exports.updateAnswerVeridity = async(answerId)=> {
    let answer = await Answer.findOne({where:{id: answerId}})
    await Answer.update({isVerified: !answer.isVerified}, {where: {id: answerId}})
    return !answer.isVerified
}

exports.getReportedQuestions = async (classId) => {
    return await db.sequelize.query(`
        SELECT DISTINCT userId, firstName, lastName, Questions.id as questionId, title, description, wasReported
        FROM Questions
        INNER JOIN Users ON Users.id = userId
        WHERE Questions.wasReported > 0 AND Questions.classId = ? AND Questions.isActive = true
    `, {
        replacements: [classId],
        type: QueryTypes.SELECT,
    });
}

exports.getReportedAnswers = async (classId) => {
    return await db.sequelize.query(`
        SELECT DISTINCT Answers.userId, Users.firstName, Users.lastName, Questions.id as questionId, title as parentTitle, Questions.description as parentDescription, Answers.description as answerDescription, Answers.id as answerId, Answers.wasReported as wasReported
        FROM Answers
        INNER JOIN Users ON Users.id = Answers.userId
        INNER JOIN Questions ON Questions.id = Answers.questionId
        WHERE Answers.wasReported > 0 AND Questions.classId = ? AND Answers.isActive = true
    `, {
        replacements: [classId],
        type: QueryTypes.SELECT,
    });
}
