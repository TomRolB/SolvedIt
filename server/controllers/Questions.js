const {Question, Answer, TaggedBy} = require("../models/")

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

exports.addQuestion = async (classId, title, description, tags) => {
    await Question.create({
        classId: classId,
        title: title,
        description: description,
        wasReported: false,
        isActive: true
    })
    const maxId = await Question.max('id')
    for (let tag of tags) {
        await TaggedBy.create({
            questionId: maxId,
            tagId: tag
        })
    }

    return "Created a question"
};