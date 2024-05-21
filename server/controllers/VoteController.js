const {Votes} = require("../models/")
const db = require("../models/index")
const {QueryTypes} = require("sequelize");

exports.upVote = async (userId, answerId) => await Votes.create({
    userId: userId,
    answerId: answerId
});

exports.voteCount = async (answerId) => {
    return await Votes.count({
        where: {
            answerId: answerId
        }
    });
}
