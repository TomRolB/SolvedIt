const {Tags} = require("../models/")

exports.getTagsOfClass = async (classId) => await Tags.findAll({
    where: {
        classId: classId
    }
});

exports.addTag = async (name, classId) => {
    await Tags.create({
        name: name,
        classId: classId
    })

    return "Created a tag"
};