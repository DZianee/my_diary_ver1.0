const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadImg = async (user, file) => {
  const cloudRes = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: `${user}_storage`,
  });
  return cloudRes;
  // console.log(cloudRes);
};

const destroyImg = async (path) => {
  await cloudinary.uploader.destroy(path);
};
module.exports = { uploadImg, destroyImg };
