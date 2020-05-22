const db = require('../../config/mongoose')
const Record = require('../record')

db.once('open', async () => {
  console.log('db connected to build record.')

  await Record.create(
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