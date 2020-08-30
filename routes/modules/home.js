const express = require('express');
const router = express.Router();
const RecordsModel = require('../../models/record');
const CategoryModel = require('../../models/category');

const { categoryData, recordsByUser } = require('../../config/dataCollect');
const { getFormatDate } = require('../../config/Util');

router.get('/', async (req, res) => {
  const user_id = req.user._id;
  // 透過是否有 id判斷要不要做篩選
  const cid = req.query.category_id;
  const selectDate = req.query.year_month;

  let allRecordsByUser = await recordsByUser(user_id);
  let sumOfamount = 0; //該使用者總金額
  allRecordsByUser.forEach((e) => {
    sumOfamount += e.amount;
  });

  // 篩選後的結果
  let recordsByuser = await recordsByUser(user_id, cid, selectDate);
  let categories = await categoryData();
  categories.forEach((c) => (c.isSelected = Number(cid) === c.category_id));

  //console.log(recordsByuser);
  //console.log(categories);

  //let sumOfcount = recordsByUser.length; //該使用者總records數
  let amountBycastegoryDate = 0; // 分類後的金額
  //console.log(recordsByuser);
  //console.log(recordsByuser.length);

  //console.log(categories);
  //recordsByUser = sortBydate(recordsByUser);

  recordsByuser.forEach((ele) => {
    amountBycastegoryDate += ele.amount;
    ele.date = getFormatDate(ele.date, 'y-m-d');
    ele.categoryInfo = categories.find(
      (c) => Number(c.category_id) === Number(ele.category_id),
    );
  });

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
});

router.get('/create', (req, res) => {
  return CategoryModel.find()
    .lean()
    .then((categories) => {
      const currentDate = new Date();
      const today = getFormatDate(currentDate, 'y-m-d');
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
