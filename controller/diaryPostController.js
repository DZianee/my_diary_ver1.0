const diaryModel = require("../model/diaryPostModel");
const httpSuccess = require("../middleware/httpSuccess");
const httpError = require("../middleware/httpErrors");
const cloudinary = require("../utils/cloudinary");

const diaryController = {
  newDiary: async (req, res) => {
    let { title, description, image, emotion, user } = req.body;
    let files = req.files;
    let imgList = [];
    try {
      for (const file of files) {
        const result = await cloudinary.uploadImg(user, file.path);
        let newImg = {
          imgCloudinary: result.secure_url,
          imgCloudPublicID: result.public_id,
        };
        imgList.push(newImg);
      }
      let diary = new diaryModel({
        title: title,
        description: description,
        image: imgList,
        emotion: emotion,
        user: user,
      });
      const newDiary = await diary.save();
      httpSuccess.successRes(res, "Create", "diary", newDiary);
    } catch (error) {
      httpError.badRequest(res, error);
    }
  },
  allDiary: async (req, res) => {
    let diaryList;
    try {
      diaryList = await diaryModel.find();
      httpSuccess.successAll(res, diaryList);
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  oneDiary: async (req, res) => {
    let diary;
    try {
      diary = await diaryModel.findById(req.params.id);
      httpSuccess.successAll(res, diary);
    } catch (error) {
      if (!diary) httpError.notFound(res, error, "diary");
      else httpError.serverError(res, error);
    }
  },
  updateDiary: async (req, res) => {
    const files = req.files;
    let { title, description, emotion, user } = req.body;
    let diary;
    let id = req.params.id;
    let imgList = [];
    try {
      diary = await diaryModel.findById(id);

      for (const img of diary.image) {
        await cloudinary.destroyImg(img.imgCloudPublicID);
      }

      for (const file of files) {
        const result = await cloudinary.uploadImg(diary.user, file.path);
        let newImg = {
          imgCloudinary: result.secure_url,
          imgCloudPublicID: result.public_id,
        };
        imgList.push(newImg);
      }
      let updateDiary = await diaryModel.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            title: title,
            description: description,
            image: imgList,
            emotion: emotion,
          },
        }
      );
      httpSuccess.successRes(res, "Update", "diary", updateDiary);
    } catch (error) {
      if (!diary) httpError.notFound(res, error, "posted diary");
      else httpError.badRequest(res, error);
    }
  },
  deleteDiary: async (req, res) => {
    let id = req.params.id;
    let diary;
    try {
      diary = await diaryModel.findById(id);
      for (const img of diary.image) {
          await cloudinary.destroyImg(img.imgCloudPublicID)
      }
      await diaryModel.findOneAndDelete({ _id: id });
      httpSuccess.successDel(res);
    } catch (error) {
      if (!diary) httpError.notFound(res, error, "posted diary");
      else httpError.badRequest(res, error);
    }
  },
};

module.exports = diaryController;
