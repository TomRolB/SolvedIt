const {Question, Answer, Users, TaggedBy} = require("../models/")
const db = require("../models/index")
const {QueryTypes} = require("sequelize");
const fs = require('fs')

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
    })

    questionsWithTags.forEach((question) => {
        let path = `./uploads/${question.id}`;
        console.log(`Does ${path} exist? ${fs.existsSync(path)}`)
        if (fs.existsSync(path)) {
            // Async version which did not work. Leaving it here
            // until commit, just in case

            // fs.readdir(path,(err, files) => {
            //     console.log(`Found files ${files}`)
            //     question.fileNames = files
            //     console.log(question)
            // })
            const files = fs.readdirSync(path)
            console.log(`Found files ${files}`)
            question.fileNames = files
            console.log(question)
        }
        else question.fileNames = []
    })

    console.log("Final result:")
    console.log(questionsWithTags)

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
    await Answer.create({
        userId: userId,
        classId: classId,
        questionId: questionId,
        parentId: parentId,
        description: description,
        wasReported: false,
        isActive: true,
        isVerified: false
    })

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
