class appFeatures {
  constructor(query, queryReq) {
    this.query = query;
    this.queryReq = queryReq;
  }

  pagination(pageSize) {
    const page = parseInt(this.queryReq.page);
    const skip = pageSize * (page - 1);
    this.query = this.query.limit(pageSize).skip(skip);
    return this;
  }
  sorting() {}
}

module.exports = appFeatures;
