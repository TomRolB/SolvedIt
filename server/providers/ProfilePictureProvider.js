// const Auth = require("../controllers/Auth");
const fs = require("fs");
const path = require("path");
exports.getPicturePath = function (res, id) {

    if (id === undefined) { //This can be written as !id
        res.status(302).send("Could not find file")
    }
    else if (!fs.existsSync(`./uploads/p${id}`)) {
        return path.resolve(__dirname + "/../uploads/default/profile.jpg")
    } else {
        const fileNames = fs.readdirSync(`./uploads/p${id}`)
        return path.resolve(__dirname + `/../uploads/p${id}/${fileNames[0]}`)
    }
}