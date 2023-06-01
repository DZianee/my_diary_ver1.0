const router = require("express").Router();
const diary = require("../controller/diaryPostController");
const multerHandler = require("../middleware/multer");

router.post("/my-diary/account/diary", multerHandler.upload, diary.newDiary);

router.get("/my-diary/account/diarylist", diary.allDiary);

router.get("/my-diary/account/diarylist/diary", diary.oneDiary);

router.put(
  "/my-diary/account/diarylist/diary/:id",
  multerHandler.upload,
  diary.updateDiary
);

router.delete("/my-diary/account/diarylist/diary/:id", diary.deleteDiary);
module.exports = router;
