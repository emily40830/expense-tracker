const express = require('express')
const router = express.Router()
const RecordsModel = require('../../models/record')
const CategoryModel = require('../../models/category')


router.get('/', (req, res) => {
  // 透過是否有 id判斷要不要做篩選
  const cid = req.query.category_id
  const totalAmount = RecordsModel.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" }
      }
    }
  ]).exec()
  if (cid) {
    const categories = CategoryModel.aggregate([
      {
        $addFields:
        {
          isSelected: { $eq: ["$category_id", Number(cid)] }
        }
      }
    ]).exec()
    const sumOfamount = RecordsModel.aggregate([
      {
        $match: { category_id: Number(cid) }
      },
      {
        $group:
        {
          _id: null,
          sumOfamount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]).exec()

    const records = RecordsModel.aggregate([
      {
        $match: { category_id: Number(cid) }
      },
      {
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
        $sort: { date: -1 }
      },
      {
        $project: {
          name: 1,
          amount: 1,
          categoryInfo: 1,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
        }
      }
    ]).exec()

    Promise.all([sumOfamount, records, categories, totalAmount])
      // .then(records => res.send(records[0].categoryInfo.categoryIcon))
      .then(([sumOfamount, records, categories, totalAmount]) => {
        if (sumOfamount.length) {
          const percent = Math.floor((sumOfamount[0].sumOfamount / totalAmount[0].totalAmount) * 100)
          res.render('index', { sumOfamount: sumOfamount[0].sumOfamount, sumOfcount: sumOfamount[0].count, records, categories, percent })
          // console.log(percent)
        } else {
          res.render('index', { sumOfamount: 0, records, categories, percent: 0 })
        }
      }
        // console.log(sumOfamount, cid)
      )
      // .then([sumOfamount,records] => res.render('index', { records }))
      .catch(err => console.log(err))

  } else {
    const categories = CategoryModel.find().lean().exec()
    const sumOfamount = RecordsModel.aggregate([{
      $group:
      {
        _id: null,
        sumOfamount: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    }]).exec()

    const records = RecordsModel.aggregate([{
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
      $sort: { date: -1 }
    },
    {
      $project: {
        name: 1,
        amount: 1,
        categoryInfo: 1,
        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
      }
    }
    ]).exec()

    Promise.all([sumOfamount, records, categories, totalAmount])
      // .then(records => res.send(records[0].categoryInfo.categoryIcon))
      .then(([sumOfamount, records, categories, totalAmount]) => {
        const sum = totalAmount[0].totalAmount
        const count = sumOfamount[0].count || 1
        res.render('index', {
          sumOfamount: sum,
          sumOfcount: count,
          records, categories, percent: 100

        })
        console.log(totalAmount)
      }

      )
      // .then([sumOfamount,records] => res.render('index', { records }))
      .catch(err => console.log(err))
  }

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