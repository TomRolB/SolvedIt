const {Tags} = require("../models/")

exports.getTagsOfClass = async (classId) =>
    await Tags.findAll({where: {classId: classId}});

exports.addTag = async (name, classId) => {
    await Tags.create({name: name, classId: classId})

    return "Created a tag"
};

exports.getTag = async (tagId) => await Tags.findByPk(tagId);

exports.destroy = async (tagId) => await Tags.destroy({where: {id: tagId}});

exports.update = async (tagId, name) => await Tags.update({name: name}, {where: {id: tagId}});