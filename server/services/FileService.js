const multer  = require('multer')
const fs= require('fs');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = './uploads/awaiting_id';

        // The following validation was initially performed to avoid having files
        // located permanently at the 'awaiting_id' directory. However,
        // this broke multi-file uploading.
        // TODO: should think of how to re-introduce this validation

        // if (fs.existsSync(dir)){
        //     throw Error("There's a file which wasn't assigned an id")
        // }

        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        cb(null, dir)
        req.body.classId
    },
    filename: function (req, file, cb) {
        // let extArray = file.mimetype.split("/");
        // let extension = extArray[extArray.length - 1];
        cb(null, file.originalname /*+ '.' +extension*/)
    }
})
exports.upload = multer({ storage: storage })