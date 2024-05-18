const express = require('express')
const router = express.Router()
const Auth = require("../controllers/Auth");
const Tags = require("../controllers/Tags");


router.get("/:classId/tags", async (req, res) => {
    const classId = req.params.classId
    const result = await Tags.getTagsOfClass(classId)
    res.json(result)
})

router.get("/:classId/tags/:tagId", async (req, res) => {
    const tagId = req.params.tagId
    console.log(tagId)
    const result = await Tags.getTag(tagId)
    res.json(result)
})

router.delete("/:classId/tags/:tagId", async (req, res) => {
    // Block this route for non-admin users
    // if (!await Auth.isAdmin(req.query.uuid, req.params.id)) return

    const tagId = req.params.tagId
    await Tags.destroy(tagId)
    res.json({message: "Tag deleted"})
})

router.put("/:classId/tags/:tagId", async (req, res) => {
    // Block this route for non-admin users
    // if (!await Auth.isAdmin(req.body.uuid, req.params.id)) return

    const tagInfo = req.body
    const tagId = req.params.tagId
    await Tags.update(tagId, tagInfo.name)
    res.json({message: "Tag updated"})
})


module.exports = router