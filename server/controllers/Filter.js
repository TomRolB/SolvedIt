const {Question, Users, TaggedBy} = require("../models/")
const Tags = require("../controllers/Tags");
const db = require("../models/index")
const {QueryTypes} = require("sequelize");
const {all} = require("express/lib/application");

exports.getQuestionsOfClass = async (classId) => await Question.findAll({
    where: {
        classId: classId
    },
    include: Users
});

exports.getSelectedQuestionsOfClass = async (classId, tags, showDeleted) => {
    console.log(showDeleted)
    const isActive = showDeleted === "true" ? 0 : 1
    console.log(isActive)
    const allTags = await Tags.getTagsOfClass(classId)
    const tagIds = allTags.map(tag => tag.id)
    const newTags = tags === undefined ? tagIds : tags
    const questionsWithTags = await db.sequelize.query(`
    WITH filteredQuestions AS (
        SELECT DISTINCT Questions.id
        FROM Questions
        INNER JOIN TaggedBies ON Questions.id = TaggedBies.questionId
        WHERE Questions.classId = ${classId} AND TaggedBies.tagId IN (${newTags}) AND ( Questions.isActive = (${isActive}) OR Questions.isActive = 1)
    )
    SELECT DISTINCT Questions.id, Questions.title, Questions.description, Questions.classId, Questions.classId, Questions.wasReported, Questions.isActive, Tags.id as tagId, Tags.name as tagName, Users.id as userId, Users.firstName as firstName, Users.lastName as lastName
    FROM Questions
    INNER JOIN filteredQuestions ON Questions.id = filteredQuestions.id
    INNER JOIN TaggedBies ON Questions.id = TaggedBies.questionId
    LEFT JOIN Tags ON TaggedBies.tagId = Tags.id
    LEFT JOIN Users ON Questions.userId = Users.id`, {
            type: QueryTypes.SELECT,
    });

    return questionsWithTags;
}
