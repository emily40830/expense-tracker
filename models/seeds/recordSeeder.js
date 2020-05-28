const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/expense'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

require('../../config/mongoose')
const Record = require('../record')

db.once('open', async () => {
  console.log('db connected to build record.')

  await Record.create(
    {
      name: '早午餐',
      category_id: 1040,
      date: new Date("2020-04-29"),
      amount: 200
    },
    {
      name: '晚餐',
      category_id: 1040,
      date: new Date("2020-05-06"),
      amount: 120
    },
    {
      name: '捷運月票',
      category_id: 1020,
      date: new Date("2020-05-03"),
      amount: 1280
    },
    {
      name: 'YoutubeMusic',
      category_id: 1030,
      date: new Date("2020-05-10"),
      amount: 199
    },
    {
      name: '母親節禮物',
      category_id: 1010,
      date: new Date("2020-05-08"),
      amount: 3000
    },
  )

  console.log("records init done.")

  db.close()
})