const {Question, Answer} = require("../models/")

exports.getQuestionsOfClass = async (classId) => await Question.findAll({
    where: {
        classId: classId
    }
});

exports.getAnswersToQuestion = async (questionId) => await Answer.findAll({
    where: {
        questionId: questionId
    }
});

exports.addQuestion = async (classId, title, description) => {
    await Question.create({
        classId: classId,
        title: title,
        description: description,
        wasReported: false,
        isActive: true
    })

    return "Created a question"
};