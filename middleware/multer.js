const multer = require("multer");
const path = require("path");

const storage = {
  imgList: multer.diskStorage({}),
};

const imgFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg") {
    cb(new Error("Unsupported these images"), false);
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage: storage.imgList,
  fileFilter: imgFilter,
  limits: { fileSize: "2048 * 2048" },
}).array("image");

module.exports = { upload };
