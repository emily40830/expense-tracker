const express = require('express')
const router = express.Router()
const RecordsModel = require('../../models/record')

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

module.exports = router