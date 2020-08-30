const RecordsModel = require('../models/record');
const CategoryModel = require('../models/category');

module.exports = {
  categoryData: (id) => {
    let condition = { category_id: id };
    if (!id) condition = {};

    return new Promise((resolve, reject) => {
      CategoryModel.find(condition)
        .lean()
        .then((category) => {
          return resolve(category);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  },
  recordsByUser: (userId, category_id, targetdate) => {
    let condition = { user_id: userId };
    if (category_id) condition.category_id = category_id;
    if (targetdate)
      condition.date = { $gte: `${targetdate}-1`, $lte: `${targetdate}-31` };
    //console.log(condition);
    return new Promise((resolve, reject) => {
      RecordsModel.find(condition)
        .sort([['date', -1]])
        .lean()
        .then((records) => {
          //console.log(records);
          return resolve(records);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  },

  recordsById: (id) => {
    return new Promise((resolve, reject) => {
      RecordsModel.findById(id)
        .lean()
        .then((record) => {
          return resolve(record);
        })
        .catch((err) => reject(err));
    });
  },
};
