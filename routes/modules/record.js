const express = require('express')
const router = express.Router()
const RecordsModel = require('../../models/record')
const CategoryModel = require('../../models/category')
const mongoose = require('mongoose')


router.get('/:id', (req, res) => {
  const id = req.params.id
  const obid = mongoose.Types.ObjectId(id)
  let cid = 0
  RecordsModel
    .findById(id)
    .select({ _id: 0, category_id: 1 })
    .then(e => {
      cid = e.category_id
      // console.log(e)
      CategoryModel.aggregate([
        {
          $addFields:
          {
            isSelected: { $eq: ["$category_id", cid] }
          }
        }
      ]).then(categories => {
        RecordsModel.aggregate([
          {
            $match: {
              _id: obid
            }
          },
          {
            $project: {
              name: 1,
              amount: 1,
              category_id: 1,
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
            }
          }
        ]).then(record => {
          res.render('edit', { record: record[0], categories })
          // res.send(record.name)
          console.log(record[0].date)
        })

      })

    })
    .catch(err => console.log(err))

  // const categories = 

  const record = RecordsModel.aggregate([
    {
      $match: {
        _id: obid
      }
    },
    {
      $project: {
        name: 1,
        amount: 1,
        category_id: 1,
        date: { $dateToString: { format: "%Y/%m/%d", date: "$date" } }
      }
    }
  ]).exec()





  // return RecordsModel.findById(id)
  //   .lean()
  //   .then(record => res.render('edit', { record, categories }))
  //   .catch(error => console.log(error))
})

router.put('/:id/edit', (req, res) => {

  const id = req.params.id
  // const obid = mongoose.Types.ObjectId(id)
  return RecordsModel.findById(id)
    .then(record => {
      record.name = req.body.name,
        record.date = req.body.date,
        record.category_id = Number(req.body.Category),
        record.amount = Number(req.body.amount)

      return record.save()
    })
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
  // console.log(req.body)

})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return RecordsModel.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})



module.exports = router