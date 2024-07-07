const Auth = require("../../controllers/Auth");
const {Users} = require('../../models/');

exports.getHtml = async (description) => {
    const teacherId = Auth.getUserId(description.uuid).id
    const teacherData = await Users.findOne({
        where: {
            id: teacherId,
        },
        attributes: ['firstName', 'lastName']
    })

    return `<p>${teacherData.firstName} ${teacherData.lastName} validated your answer:</p>
            <p>${description.notificationInfo.description}</p>`
}