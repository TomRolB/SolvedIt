const Auth = require("../../controllers/Auth");
const {Users} = require('../../models/');

exports.getHtml = async (description) => {
    const respondentId = Auth.getUserId(description.uuid).id
    const respondentData = await Users.findOne({
        where: {
            id: respondentId,
        },
        attributes: ['firstName', 'lastName']
    })

    return `<p>${respondentData.firstName} ${respondentData.lastName} answered your question:</p>
            <p><b>You:</b></p>
            <h4>${description.notificationInfo.questionInfo.title}</h4>
            <p>${description.notificationInfo.questionInfo.description}</p><br>
            <p><b>${respondentData.firstName} ${respondentData.lastName}:</b></p>
            <p>${description.notificationInfo.answerInfo.description}</p>`
}