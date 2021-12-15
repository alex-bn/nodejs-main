/* eslint-disable node/no-unsupported-features/es-syntax */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // ?duration=5&difficulty=easy
    // ?duration[gte]=5&difficulty=easy
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    // this, is the object itself that makes it possible to chain one method after another
    return this;
  }

  sort() {
    // ?sort=price,-ratingsAverage
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    // this, is the object itself that makes it possible to chain one method after another
    return this;
  }

  limitFields() {
    // ?fields=name,difficulty,price,images
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    // this, is the object itself that makes it possible to chain one method after another
    return this;
  }

  paginate() {
    // ?page=2&limit=3
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // this, is the object itself that makes it possible to chain one method after another
    return this;
  }
}
module.exports = APIFeatures;
