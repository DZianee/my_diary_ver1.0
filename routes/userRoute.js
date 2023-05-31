const user = require("../controller/userController");
const router = require("express").Router();
const authHandler = require("../middleware/authHandler");

router.post("/my-diary/admin/account", user.newUser);

router.post("/my-diary/register/account", user.registerUser);

router.post("/my-diary/login", user.checkAccount, user.loginUser);

router.post("/my-diary/refresh", user.refreshToken);

router.get(
  "/my-diary/admin/account/list",

  user.allUser
);

router.get(
  "/my-diary/my-account/:id",

  user.oneAccount
);

router.patch("/my-diary/account/:id", user.updateForUser, user.updatePassword);

router.patch(
  "/diary-management/admin/user-list/:id",
  user.updateForAdmin,
  user.updatePassword
);

router.delete("/diary-management/admin/user-list/:id", user.deleteUser);

module.exports = router;
