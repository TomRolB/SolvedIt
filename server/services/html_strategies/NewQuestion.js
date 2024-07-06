const Auth = require("../../controllers/Auth");
const {Users} = require('../../models/');

exports.getHtml = async (description) => {
    const publisherId = Auth.getUserId(description.uuid).id
    const publisherData = await Users.findOne({
        where: {
            id: publisherId,
        },
        attributes: ['firstName', 'lastName']
    })

    return `<p>${publisherData.firstName} ${publisherData.lastName} posted a new question:</p>
            <h4>${description.notificationInfo.title}</h4>
            <p>${description.notificationInfo.description}</p>`
}