const userModel = require("../model/userModel");
const httpSuccess = require("../middleware/httpSuccess");
const httpError = require("../middleware/httpErrors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userController = {
  refreshCode: "",
  newUser: async (req, res) => {
    let emotion = "none";
    let password = req.body.password;
    try {
      let hashed = bcrypt.hash(password, bcrypt.genSalt(10));

      const newUser = new userModel({
        avatar: req.body.avatar,
        username: req.body.username,
        email: req.body.email,
        password: hashed,
        role: req.body.role,
        emotion: emotion,
      });
      let user = await newUser.save();
      httpSuccess.successRes(res, "Create", "staff in system", user);
    } catch (error) {
      httpError.badRequest(res, error);
    }
  },
  registerUser: async (req, res) => {
    let emotion = "none";
    let { password, email } = req.body;
    try {
      const existEmail = await userModel.findOne({ email: email });
      if (existEmail) {
        res.status(400).send({ message: "Email is existed. Try another one" });
      } else {
        const hashed = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const newUser = new userModel({
          avatar: req.body.avatar,
          username: req.body.username,
          email: email,
          password: hashed,
          role: req.body.role,
          emotion: emotion,
          status: "Active",
        });
        let user = await newUser.save();
        httpSuccess.successRes(res, "Create", "new account", user);
      }
    } catch (error) {
      httpError.badRequest(res, error);
    }
  },
  loginUser: async (req, res) => {
    let { password, email } = req.body;
    try {
      const account = await userModel.findOne({ email: email });
      account.lastLogin = Date.now();
      await account.save();
      const token = jwt.sign({ id: account._id }, process.env.JWT_SECRET_CODE, {
        expiresIn: "30s",
      });
      const refreshToken = jwt.sign(
        { id: account._id },
        process.env.JWT_REFRESH_SECRET_CODE,
        {
          expiresIn: "1m",
        }
      );
      this.refreshCode = refreshToken;
      res.status(200).send({
        message: "Login verified",
        data: {
          id: account._id,
          email: account.email,
          lastLogin: account.lastLogin,
          token: token,
          refreshToken: refreshToken,
          avatar: account.avatar,
          username: account.username,
          role: account.role,
          emotion: account.emotion,
        },
      });
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  checkAccount: async (req, res, next) => {
    let { password, email } = req.body;
    let account;
    try {
      account = await userModel.findOne({ email: email });
      let checkPassword = await bcrypt.compare(password, account.password);
      if (!checkPassword)
        res.status(404).send({ message: "Password is not exist" });
      else next();
    } catch (error) {
      if (!account) httpError.notFound(res, error, "account");
      else httpError.serverError(res, error);
    }
  },
  refreshToken: (req, res) => {
    const refreshToken = this.refreshCode;
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_CODE,
      (err, user) => {
        if (err) httpError.badRequest(res, err);
        else {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_CODE, {
            expiresIn: "30s",
          });
          res.status(200).send({
            message: "Refresh token successfully",
            token: token,
          });
        }
      }
    );
  },
  allUser: async (req, res) => {
    try {
      const allUsers = await userModel.find();
      httpSuccess.successAll(res, allUsers);
    } catch (error) {
      httpError.badRequest(res, error);
    }
  },
  oneAccount: async (req, res) => {
    let { id } = req.params;
    let user;
    try {
      account = await userModel.findOne({ _id: id });
      httpSuccess.successAll(res, account);
    } catch (error) {
      if (!account) httpError.notFound(res, error, "account");
      else httpError.serverError(res, error);
    }
  },
  updateForUser: async (req, res, next) => {
    let { avatar, username, password } = req.body;
    let id = req.params.id;
    let account;
    try {
      if (!password) {
        account = await userModel.findOne({ _id: id });
        if (!account) httpError.notFound(res, error, "account");
        else {
          let updateInfo = await userModel.updateOne(
            { _id: id },
            {
              $set: {
                avatar: avatar,
                username: username,
              },
            }
          );
          httpSuccess.successRes(res, "Update", "account info", updateInfo);
        }
      } else next();
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  updateForAdmin: async (req, res, next) => {
    let { username, password, email, role, status } = req.body;
    let id = req.params.id;
    let account;
    try {
      if (!password) {
        account = await userModel.findOne({ _id: id });
        if (!account) httpError.notFound(res, error, "account");
        else {
          let updateInfo = await userModel.updateOne(
            { _id: id },
            {
              $set: {
                username: username,
                email: email,
                role: role,
                status: status,
              },
            }
          );
          httpSuccess.successRes(res, "Update", "staff info", updateInfo);
        }
      } else next();
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  updatePassword: async (req, res) => {
    let { password, newPassword } = req.body;
    let id = req.params.id;
    let account;
    try {
      account = await userModel.findOne({ _id: id });
      const existPassword = await bcrypt.compare(password, account.password);
      if (!existPassword)
        res.status(404).send({ message: "Password is not exist" });
      else {
        const hashed = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        let updateInfo = await userModel.updateOne(
          { _id: id },
          {
            $set: {
              password: hashed,
            },
          }
        );
        httpSuccess.successRes(res, "Update", "password", updateInfo);
      }
    } catch (error) {
      if (!account) httpError.notFound(res, error, "account");
      else httpError.serverError(res, error);
    }
  },
  deleteUser: async (req, res) => {
    let { id } = req.params;
    let user;
    try {
      user = await userModel.findById(id);
      await userModel.findOneAndDelete({ _id: id });
      httpSuccess.successDel(res);
    } catch (error) {
      if (!user) httpError.notFound(res, error, user);
      else httpError.serverError(res, error);
    }
  },
};

module.exports = userController;
