const {DiscordChannelLink} = require("../models/");

exports.classIsLinked = async (req)=> {
    const classId = req.params.id
    const channelLink = await DiscordChannelLink.findOne({where:{classId: classId}})
    return channelLink !== null
}

exports.getChannelId = async (classId) => {
    const channelData = await DiscordChannelLink.findOne({
        where: {classId: classId},
        attributes: ['channelId']
    })

    return channelData?.channelId
}
