const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
  category_id: Number,
  categoryName: String,
  categoryIcon: String
})

module.exports = mongoose.model("Category", categorySchema)