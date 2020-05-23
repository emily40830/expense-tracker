const db = require('../../config/mongoose')
const Category = require('../category')

db.once('open', async () => {
  console.log('db connected to build category.')
  await Category.create(
    {
      category_id: 1010,
      categoryName: '家居物業',
      categoryIcon: 'fas fa-home'
    },
    {
      category_id: 1020,
      categoryName: '交通出行',
      categoryIcon: 'fas fa-shuttle-van'
    },
    {
      category_id: 1030,
      categoryName: '休閒娛樂',
      categoryIcon: 'fas fa-grin-beam'
    },
    {
      category_id: 1040,
      categoryName: '餐飲食品',
      categoryIcon: 'fas fa-utensils'
    },
    {
      category_id: 1050,
      categoryName: '其他',
      categoryIcon: 'fas fa-pen'
    }
  )

  console.log('Category set up.')
  db.close()
})

