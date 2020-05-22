const mongoose = require('mongoose')
const recordSchema = new mongoose.Schema({
  name: String,
  category_id: Number,
  date: Date,
  amount: Number
})

module.exports = mongoose.model('Record', recordSchema)