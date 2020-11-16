const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  { name: { type: String, trim: true, maxLength: 32, required: true } },
  { timestamps: true }
)

module.exports = mongoose.model('Category', categorySchema)
