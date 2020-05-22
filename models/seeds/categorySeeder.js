const db = require('../../config/mongoose')
const Category = require('../category')

db.once('open', async () => {
  console.log('db connected to build category.')
  await Category.create(
    {
      category_id: 1010,
      categoryName: '家居物業',
      categoryIcon: '<i class="fas fa-home"></i>'
    },
    {
      category_id: 1020,
      categoryName: '交通出行',
      categoryIcon: '<i class="fas fa-shuttle-van"></i>'
    },
    {
      category_id: 1030,
      categoryName: '休閒娛樂',
      categoryIcon: '<i class="fas fa-grin-beam"></i>'
    },
    {
      category_id: 1040,
      categoryName: '餐飲食品',
      categoryIcon: '<i class="fas fa-utensils"></i>'
    },
    {
      category_id: 1050,
      categoryName: '其他',
      categoryIcon: '<i class="fas fa-pen"></i>'
    }
  )

  console.log('Category set up.')
  db.close()
})

