import {Model} from "sequelize";

const Question = require("../models/Question")
const Answer = require("../models/Answer")

async function getQuestionsOfClass(classId: number): Promise<Model[]> {
    return await Question.findAll({
        where: {
            classId: classId
        }
    })
}

async function getAnswersToQuestion(questionId: number): Promise<Model[]> {
    return await Question.findAll({
        where: {
            questionId: questionId
        }
    })
}