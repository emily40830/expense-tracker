const express = require('express');
const router = express.Router();
const RecordsModel = require('../../models/record');
const CategoryModel = require('../../models/category');
const mongoose = require('mongoose');

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const obid = mongoose.Types.ObjectId(id);
  let cid = 0;
  RecordsModel.findById(id)
    .select({ _id: 0, category_id: 1 })
    .then((e) => {
      cid = e.category_id;
      // console.log(e)
      CategoryModel.aggregate([
        {
          $addFields: {
            isSelected: { $eq: ['$category_id', cid] },
          },
        },
      ]).then((categories) => {
        RecordsModel.aggregate([
          {
            $match: {
              _id: obid,
            },
          },
          {
            $project: {
              name: 1,
              amount: 1,
              category_id: 1,
              merchandise: 1,
              date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            },
          },
        ]).then((record) => {
          console.log(record);
          const currentDate = new Date();
          let day = ('0' + currentDate.getDate()).slice(-2);
          let month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
          let year = currentDate.getFullYear();
          const today = year + '-' + month + '-' + day;
          res.render('edit', { record: record[0], categories, today });
          // res.send(record.name)
          // console.log(record[0].date)
        });
      });
    })
    .catch((err) => console.log(err));

  // return RecordsModel.findById(id)
  //   .lean()
  //   .then(record => res.render('edit', { record, categories }))
  //   .catch(error => console.log(error))
});

router.put('/:id/edit', (req, res) => {
  const id = req.params.id;
  // const obid = mongoose.Types.ObjectId(id)
  return RecordsModel.findById(id)
    .then((record) => {
      (record.name = req.body.name),
        (record.date = req.body.date),
        (record.category_id = Number(req.body.Category)),
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
