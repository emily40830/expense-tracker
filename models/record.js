const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const recordSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category_id: {
    type: Number,
    required: true,
  },
  date: { type: Date, required: true },
  amount: { type: Number, min: 0, required: true },
  merchandise: {
    type: String,
    default: '未分類',
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Record', recordSchema);
