const express = require('express');
const router = express.Router();
const RecordsModel = require('../../models/record');
const CategoryModel = require('../../models/category');
const mongoose = require('mongoose');

const {
  categoryData,
  recordsByUser,
  recordsById,
} = require('../../config/dataCollect');
const { getFormatDate } = require('../../config/Util');

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  //const obid = mongoose.Types.ObjectId(id);
  const each = await recordsById(id);
  each.date = getFormatDate(each.date, 'y-m-d');
  const cid = each.category_id;

  const categories = await categoryData();
  categories.forEach((c) => {
    c.isSelected = Number(cid) === Number(c.category_id);
  });
  const today = getFormatDate(new Date(), 'y-m-d');

  res.render('edit', { record: each, categories, today });
});

router.put('/:id/edit', (req, res) => {
  const id = req.params.id;
  // const obid = mongoose.Types.ObjectId(id)
  return RecordsModel.findById(id)
    .then((record) => {
      (record.name = req.body.name),
        (record.date = req.body.date),
        (record.category_id = Number(req.body.Category)),
        (record.merchandise = req.body.merchandise),
        (record.amount = Number(req.body.amount));

      return record.save();
    })
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error));
  // console.log(req.body)
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  return RecordsModel.findById(id)
    .then((record) => record.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error));
});

module.exports = router;
