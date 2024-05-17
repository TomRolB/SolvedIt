const {Question, Answer, TaggedBy} = require("../models/")
const db = require("../models/index")
const {QueryTypes} = require("sequelize");

exports.getQuestionsOfClass = async (classId) => await Question.findAll({
    where: {
        classId: classId
    }
});

exports.getQuestionsWithTags = async (classId) => {
    const questionsWithTags = await db.sequelize.query(`
        SELECT DISTINCT Questions.id, Questions.title, Questions.description, Questions.classId, Questions.classId, Questions.wasReported, Questions.isActive, Tags.id as tagId, Tags.name as tagName
        FROM Questions 
        LEFT JOIN TaggedBies ON Questions.id = TaggedBies.questionId
        LEFT JOIN Tags ON TaggedBies.tagId = Tags.id
        WHERE Questions.classId = ?`, {
            replacements: [classId],
            type: QueryTypes.SELECT,
        }
    );
    console.log(questionsWithTags)
    return questionsWithTags
}

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
    if (tags === undefined || tags === null) return "Created a question"
    for (let tag of tags) {
        await TaggedBy.create({
            questionId: maxId,
            tagId: tag
        })
    }

    return "Created a question"
};