const express = require('express');
const router = express.Router();
const RecordsModel = require('../../models/record');
const CategoryModel = require('../../models/category');

const categoryData = (id) => {
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
};

const recordsByUser = (userId, category_id, targetdate) => {
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
};

const recordsBydate = (targetdate) => {
  let condition = {
    date: { $gte: `${targetdate}-1`, $lte: `${target - date}-31` },
  };
  if (!targetdate) condition = {};
  return new Promise((resolve, reject) => {
    RecordsModel.find({
      date: { $gte: `${targetdate}-1`, $lte: `${target - date}-31` },
    })
      .lean()
      .then((records) => {
        //console.log(records);
        return resolve(records);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

router.get('/', async (req, res) => {
  // 透過是否有 id判斷要不要做篩選
  const cid = req.query.category_id;
  const selectDate = req.query.year_month;
  const user_id = req.user._id;

  let allRecordsByUser = await recordsByUser(user_id);
  let sumOfamount = 0; //該使用者總金額
  allRecordsByUser.forEach((e) => {
    sumOfamount += e.amount;
  });

  // 篩選後的結果
  let recordsByuser = await recordsByUser(user_id, cid, selectDate);
  let categories = await categoryData();
  categories.forEach((c) => (c.isSelected = Number(cid) === c.category_id));

  //categories.isSelected = Number(cid) === ;
  console.log(recordsByuser);
  console.log(categories);

  //let sumOfcount = recordsByUser.length; //該使用者總records數
  let amountBycastegoryDate = 0; // 分類後的金額
  //console.log(recordsByuser);
  console.log(recordsByuser.length);
  //console.log(totalCount);
  //console.log(categories);
  //recordsByUser = sortBydate(recordsByUser);

  recordsByuser.forEach((ele) => {
    amountBycastegoryDate += ele.amount;
    ele.date = getFormatDate(ele.date, 'y-m-d');
    ele.categoryInfo = categories.find(
      (c) => Number(c.category_id) === Number(ele.category_id),
    );
  });

  //recordsByUser = recordsByUser.
  let percent = Math.round((amountBycastegoryDate / sumOfamount) * 100, 1);

  res.render('index', {
    sumOfamount: amountBycastegoryDate,
    sumOfcount: recordsByuser.length,
    records: recordsByuser,
    categories,
    percent,
    selectDate,
    maxYm: getFormatDate(new Date(), 'y-m'),
  });
  // 要傳入handlebars的資料

  // sumOfamount: 0,
  //             records,
  //             categories,
  //             percent: 0,
  //             selectDate,
  //             maxYm: getFormatDate(new Date(), 'y-m')

  //console.log(recordsByuser);

  //recordsByUser.foreach(r=>)

  //const findCondition = { user_id: req.user._id };
  //console.log(selectDate);
  // join all data
  //
  // const totalAmount = RecordsModel.aggregate([
  //   {
  //     $group: {
  //       _id: null,
  //       totalAmount: { $sum: '$amount' },
  //     },
  //   },
  // ]).exec();

  // if (cid) {
  //   const categories = CategoryModel.aggregate([
  //     {
  //       $addFields: {
  //         isSelected: { $eq: ['$category_id', Number(cid)] },
  //       },
  //     },
  //   ]).exec();
  //   const sumOfamount = RecordsModel.aggregate([
  //     {
  //       $match: { category_id: Number(cid) },
  //     },
  //     {
  //       $group: {
  //         _id: null,
  //         sumOfamount: { $sum: '$amount' },
  //         count: { $sum: 1 },
  //       },
  //     },
  //   ]).exec();

  //   const records = RecordsModel.aggregate([
  //     {
  //       $match: { category_id: Number(cid) },
  //     },
  //     {
  //       $lookup: {
  //         from: 'categories',
  //         localField: 'category_id',
  //         foreignField: 'category_id',
  //         as: 'categoryInfo',
  //       },
  //     },
  //     {
  //       $unwind: '$categoryInfo',
  //     },
  //     {
  //       $sort: { date: -1 },
  //     },
  //     {
  //       $project: {
  //         name: 1,
  //         amount: 1,
  //         categoryInfo: 1,
  //         date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
  //       },
  //     },
  //   ]).exec();

  //   Promise.all([sumOfamount, records, categories, totalAmount])
  //     // .then(records => res.send(records[0].categoryInfo.categoryIcon))
  //     .then(
  //       ([sumOfamount, records, categories, totalAmount]) => {
  //         if (sumOfamount.length) {
  //           const percent = Math.floor(
  //             (sumOfamount[0].sumOfamount / totalAmount[0].totalAmount) * 100,
  //           );
  //           res.render('index', {
  //             sumOfamount: sumOfamount[0].sumOfamount,
  //             sumOfcount: sumOfamount[0].count,
  //             records,
  //             categories,
  //             percent,
  //             selectDate,
  //             maxYm: getFormatDate(new Date(), 'y-m'),
  //           });
  //           // console.log(percent)
  //         } else {
  //           res.render('index', {
  //             sumOfamount: 0,
  //             records,
  //             categories,
  //             percent: 0,
  //             selectDate,
  //             maxYm: getFormatDate(new Date(), 'y-m'),
  //           });
  //         }
  //       },
  //       // console.log(sumOfamount, cid)
  //     )
  //     // .then([sumOfamount,records] => res.render('index', { records }))
  //     .catch((err) => console.log(err));
  // } else {
  //   const categories = CategoryModel.find().lean().exec();
  //   const sumOfamount = RecordsModel.aggregate([
  //     {
  //       $group: {
  //         _id: null,
  //         sumOfamount: { $sum: '$amount' },
  //         count: { $sum: 1 },
  //       },
  //     },
  //   ]).exec();

  //   const records = RecordsModel.aggregate([
  //     {
  //       $lookup: {
  //         from: 'categories',
  //         localField: 'category_id',
  //         foreignField: 'category_id',
  //         as: 'categoryInfo',
  //       },
  //     },
  //     {
  //       $unwind: '$categoryInfo',
  //     },
  //     {
  //       $sort: { date: -1 },
  //     },
  //     {
  //       $project: {
  //         name: 1,
  //         amount: 1,
  //         categoryInfo: 1,
  //         date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
  //       },
  //     },
  //   ]).exec();

  //   Promise.all([sumOfamount, records, categories, totalAmount])
  //     // .then(records => res.send(records[0].categoryInfo.categoryIcon))
  //     .then(([sumOfamount, records, categories, totalAmount]) => {
  //       // if (totalAmount) {
  //       const totalexistedOrnot = totalAmount.length > 0;
  //       const sumexistedOrnot = totalAmount.length > 0;

  //       const sum = totalexistedOrnot ? totalAmount[0].totalAmount : 0;
  //       const count = sumexistedOrnot ? sumOfamount[0].count || 1 : 0;
  //       //console.log(categories, selectDate);
  //       //console.log(selectDate);
  //       res.render('index', {
  //         sumOfamount: sum,
  //         sumOfcount: count,
  //         records,
  //         categories,
  //         percent: 100,
  //         selectDate,
  //         maxYm: getFormatDate(new Date(), 'y-m'),
  //       });
  //       // } else {
  //       //   res.render('index', {
  //       //     sumOfamount: 0,
  //       //     sumOfcount: 0,
  //       //     records, categories, percent: 0

  //       //   })
  //       // }

  //       //console.log(totalAmount)
  //     })
  //     // .then([sumOfamount,records] => res.render('index', { records }))
  //     .catch((err) => console.log(err));
  // }
});

router.get('/create', (req, res) => {
  return CategoryModel.find()
    .lean()
    .then((categories) => {
      const currentDate = new Date();
      let day = ('0' + currentDate.getDate()).slice(-2);
      let month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
      let year = currentDate.getFullYear();
      const today = year + '-' + month + '-' + day;
      res.render('create', { categories, today });
    });
});

router.post('/create', (req, res) => {
  const user_id = req.user._id;
  const { name, category_id, date, amount, merchandise } = req.body;
  return RecordsModel.create({
    name,
    category_id: Number(category_id),
    date,
    amount: Number(amount),
    user_id,
    merchandise,
  })
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error));
  // console.log(req.body)
});
module.exports = router;

const getFormatDate = (date, format) => {
  const currentDate = new Date();
  const target = date === currentDate ? currentDate : date;

  let day = ('0' + target.getDate()).slice(-2);
  let month = ('0' + (target.getMonth() + 1)).slice(-2);
  let year = target.getFullYear();

  switch (format) {
    case 'y-m-d':
      return year + '-' + month + '-' + day;
    case 'y-m':
      return year + '-' + month;
  }
};

const sortBydate = (myArguments) => {
  return myArguments.sort(function (a, b) {
    return b.date - a.date;
  });
};
