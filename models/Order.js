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
    required: true // 1 = pending, 2 = approved, 3 = Delievered, 4 == Rejected
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  price: {
    type: Number,
    default: 0
  },
  createdOn: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Order', orderSchema)
