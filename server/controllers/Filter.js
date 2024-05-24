const {Question, Tags, Users, TaggedBy} = require("../models/")
const db = require("../models/index")
const {QueryTypes} = require("sequelize");

exports.getQuestionsOfClass = async (classId) => await Question.findAll({
    where: {
        classId: classId
    },
    include: Users
});

exports.getSelectedQuestionsOfClass = async (classId, tags, hidden) => {
    const isActive = hidden ? 0 : 1;
    const newTags = tags === undefined ? await Tags.getTagsOfClass(classId) : tags;
    const questionsWithTags = await db.sequelize.query(`
    SELECT DISTINCT Questions.id, Questions.title, Questions.description, Questions.classId, Questions.classId, Questions.wasReported, Questions.isActive, Tags.id as tagId, Tags.name as tagName, Users.id as userId, Users.firstName as firstName, Users.lastName as lastName
    FROM Questions
    INNER JOIN TaggedBies ON Questions.id = TaggedBies.questionId
    LEFT JOIN Tags ON TaggedBies.tagId = Tags.id
    LEFT JOIN Users ON Questions.userId = Users.id
    WHERE Questions.classId = ${classId}
    AND TaggedBies.tagId IN (${newTags}) AND Questions.isActive = (${isActive})`, {
            type: QueryTypes.SELECT,
    });

    return questionsWithTags;
}
