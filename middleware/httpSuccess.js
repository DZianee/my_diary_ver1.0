const httpSuccessRequest = {
  successAll: (res, result) => {
    res
      .status(200)
      .send({ message: "Retrieved data successfully", data: result });
  },
  successRes: (res, type, data, result) => {
    res
      .status(201)
      .send({ message: `${type} ${data} successfully`, data: { result } });
  },
  successDel: (res) => {
    res.status(204).send({ message: "Remove data successfully" });
  },
};

module.exports = httpSuccessRequest;
