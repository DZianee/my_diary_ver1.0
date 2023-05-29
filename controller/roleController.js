const roleModel = require("../model/roleModel");
const httpSuccess = require("../middleware/httpSuccess");
const httpError = require("../middleware/httpErrors");

const roleController = {
  newRole: async (req, res) => {
    const role = new roleModel({
      name: req.body.name,
      status: req.body.status,
    });
    try {
      const saveRole = await role.save();
      httpSuccess.successRes(res, "Create", "role", saveRole);
    } catch (error) {
      httpError.badRequest(res, error);
    }
  },
  checkExistRole: async (req, res, next) => {
    let { name } = req.body;
    try {
      const findRole = await roleModel.findOne({ name: name });
      if (findRole)
        res.status(400).send({
          message:
            "Duplicated role! You are not allowed to proceed the process",
        });
      else next();
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  allRole: async (req, res) => {
    try {
      const role = await roleModel.find().sort({});
      httpSuccess.successAll(res, role);
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  oneRole: async (req, res) => {
    let { id } = req.params;
    let role;
    try {
      role = await roleModel.findById(id);
      httpSuccess.successAll(res, role);
    } catch (error) {
      if (!role) httpError.notFound(res, error, "role");
      else httpError.serverError(res, error);
    }
  },
  updateRole: async (req, res) => {
    let { id } = req.params;
    let role;

    try {
      role = await roleModel.findById(id);
      const model = {
        name: req.body.name,
        status: req.body.status,
      };
      const updateRole = await roleModel.updateOne(
        { _id: id },
        { $set: model }
      );
      httpSuccess.successRes(res, "Update", "role", updateRole);
    } catch (error) {
      if (!role) httpError.notFound(res, error, role);
      else httpError.serverError(res, error);
    }
  },
  deleteRole: async (req, res) => {
    let { id } = req.params;
    let role;
    try {
      role = await roleModel.findById(id);
      await roleModel.findOneAndDelete({ _id: id });
      httpSuccess.successDel(res);
    } catch (error) {
      if (!role) httpError.notFound(res, error, role);
      else httpError.serverError(res, error);
    }
  },
};

module.exports = roleController;
