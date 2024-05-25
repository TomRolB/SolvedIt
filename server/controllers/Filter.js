const {Question, Users} = require("../models/")
const db = require("../models/index")
const {QueryTypes} = require("sequelize");
const {getQuestionsWithTags} = require("./Questions");

exports.getQuestionsOfClass = async (classId) => await Question.findAll({
    where: {
        classId: classId
    },
    include: Users
});

exports.getSelectedQuestionsOfClass = async (classId, tags, showDeleted, userId, isAdmin) => {
    const isActive = showDeleted === "true" ? 0 : 1
    if (tags === undefined) {
        return await getQuestionsWithTags(classId, userId, isAdmin, isActive)
    } else {
        const questionsWithTags = await db.sequelize.query(`
        WITH filteredQuestions AS (
            SELECT DISTINCT Questions.id
            FROM Questions
            INNER JOIN TaggedBies ON Questions.id = TaggedBies.questionId
            WHERE Questions.classId = ${classId} AND TaggedBies.tagId IN (${tags}) AND ( Questions.isActive = (${isActive}) OR Questions.isActive = 1)
        )
        SELECT DISTINCT Questions.id, Questions.title, Questions.description, Questions.classId, Questions.classId, Questions.wasReported, Questions.isActive, Tags.id as tagId, Tags.name as tagName, Users.id as userId, Users.firstName as firstName, Users.lastName as lastName
        FROM Questions
        INNER JOIN filteredQuestions ON Questions.id = filteredQuestions.id
        INNER JOIN TaggedBies ON Questions.id = TaggedBies.questionId
        LEFT JOIN Tags ON TaggedBies.tagId = Tags.id
        LEFT JOIN Users ON Questions.userId = Users.id`, {
            type: QueryTypes.SELECT,
        });

        questionsWithTags.forEach((question) => {
            console.log(question)
            return question.canBeDeleted = question.userId === userId || isAdmin;
        })
        return questionsWithTags
    }
}
