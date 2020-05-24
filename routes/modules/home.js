const express = require('express')
const router = express.Router()
const RecordsModel = require('../../models/record')

const CategoryModel = require('../../models/category')

router.get('/', (req, res) => {
  return RecordsModel.aggregate([{
    $lookup: {
      from: 'categories',
      localField: 'category_id',
      foreignField: 'category_id',
      as: 'categoryInfo'
    }
  }, {
    $unwind: "$categoryInfo"
  },
  {
    $project: {
      name: 1,
      amount: 1,
      categoryInfo: 1,
      date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
    }
  }
  ])
    // .then(records => res.send(records[0].categoryInfo.categoryIcon))
    .then(records => res.render('index', { records }))
    .catch(err => console.log(err))
})

router.get('/create', (req, res) => {
  return CategoryModel.find()
    .lean()
    .then(categories => {
      const currentDate = new Date()
      let day = ("0" + currentDate.getDate()).slice(-2)
      let month = ("0" + (currentDate.getMonth() + 1)).slice(-2)
      let year = currentDate.getFullYear()
      const today = year + "-" + month + "-" + day
      res.render('create', { categories, today })
    })

})

router.post('/create', (req, res) => {
  const { name, category_id, date, amount } = req.body
  return RecordsModel.create({ name, category_id: Number(category_id), date, amount: Number(amount) })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
  // console.log(req.body)
})
module.exports = router