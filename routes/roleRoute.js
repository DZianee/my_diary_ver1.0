const role = require("../controller/roleController");
const router = require("express").Router();

router.post("/diary-management/admin/role", role.checkExistRole, role.newRole);

router.get("/diary-management/admin/role", role.allRole);

router.get("/diary-management/admin/role/:id", role.oneRole);

router.put("/diary-management/admin/role/:id",role.updateRole)
router.patch("/diary-management/admin/role/:id",role.updateRole)

router.delete("/diary-management/admin/role/:id", role.deleteRole)

module.exports = router;
