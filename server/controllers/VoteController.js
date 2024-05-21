const {Votes} = require("../models/")
const db = require("../models/index")
const {QueryTypes} = require("sequelize");

exports.upVote = async (userId, answerId) => await Votes.create({
    userId: userId,
    answerId: answerId
});

exports.undoVote = async (userId, answerId) => await Votes.destroy({
    where: {
        userId: userId,
        answerId: answerId
    }
});

exports.voteCount = async (answerId) => {
    return await Votes.count({
        where: {
            answerId: answerId
        }
    });
}

exports.hasUserVoted = async (answerId, userId) => {
    let voteEntry = await Votes.findOne({
        where: {
            answerId: answerId,
            userId: userId
        }
    });

    return !!voteEntry
};
