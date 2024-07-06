const NewQuestion = require("./NewQuestion")
const AnswerValidation = require("./AnswerValidation")

const strategies = {
    "newQuestion": NewQuestion,
    "answerValidation": AnswerValidation
}

exports.getHtml = async (description) => {
    return await strategies[description.notificationType]?.getHtml(description)
}