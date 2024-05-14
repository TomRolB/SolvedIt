const {Question, Answer, Users} = require("../models/")

exports.getQuestionsOfClass = async (classId) => await Question.findAll({
    where: {
        classId: classId
    },
    include: Users
});

exports.getAnswersToQuestion = async (questionId) => await Answer.findAll({
    where: {
        questionId: questionId
    },
    include: Users
});

exports.addQuestion = async (userId, classId, title, description) => {
    await Question.create({
        userId: userId,
        classId: classId,
        title: title,
        description: description,
        wasReported: false,
        isActive: true
    })

    return "Created a question"
};

exports.addAnswer = async (userId, classId, questionId, parentId, description) => {
    await Question.create({
        userId: userId,
        classId: classId,
        parentId: parentId,
        description: description,
        wasReported: false,
        isActive: true
    })

    return "Created an answer"
};