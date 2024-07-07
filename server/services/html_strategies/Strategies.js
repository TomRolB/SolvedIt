const NewQuestion = require("./NewQuestion")
const AnswerValidation = require("./AnswerValidation")
const NewAnswer = require("./NewAnswer")

const strategies = {
    "newQuestion": NewQuestion,
    "newAnswer": NewAnswer,
    "answerValidation": AnswerValidation
}

exports.getHtml = async (description) => {
    return await strategies[description.notificationType]?.getHtml(description)
}