const {Tags} = require("../models/")

exports.getTagsOfClass = async (tagId) => await Tags.findAll({
    where: {
        id: tagId
    }
});

exports.addTag = async (name, classId) => {
    await Tags.create({
        name: name,
        classId: classId
    })

    return "Created a tag"
};