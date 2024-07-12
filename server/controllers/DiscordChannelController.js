const {DiscordChannelLink} = require("../models/");

exports.classIsLinked = async (req)=> {
    const classId = req.params.id
    const channelLink = await DiscordChannelLink.findOne({where:{classId: classId}})
    return channelLink !== null
}