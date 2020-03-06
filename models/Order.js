const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  notes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notes'
  },
  status: {
    type: Number,
    default: 1 // 1 = pending, 2 = approved, 3 = Delievered
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  price: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Order', orderSchema)
