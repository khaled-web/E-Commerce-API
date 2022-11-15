//activate mongoose-package
const mongoose = require('mongoose');

//CreateSingleCartItemSchema
// const SingleOrderItemSchema = mongoose.Schema({
//  name: {
//   type: String,
//   required: true
//  },

//  image: {
//   type: String,
//   required: true
//  },

//  price: {
//   type: Number,
//   required: true
//  },

//  amount: {
//   type: Number,
//   required: true
//  },

//  Product: {
//   type: mongoose.Schema.ObjectId,
//   ref: 'User',
//   required: true
//  }
// })

//CreateOrderSchema
const OrderSchema = mongoose.Schema({
 tax: {
  type: Number,
  required: true,
 },

 shippingFee: {
  type: Number,
  required: true,
 },

 subtotal: {
  type: Number,
  required: true
 },

 total: {
  type: Number,
  required: true
 },

 // orderItems: [SingleOrderItemSchema],

 status: {
  type: String,
  enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
  default: 'pending'
 },

 user: {
  type: mongoose.Schema.ObjectId,
  ref: 'User',
  required: true
 },

 clientSecret: {
  type: String,
  required: true
 },

 paymentIntentId: {
  type: String
 }
}, {
 timestamps: true
});

//exportingOrderSchema
module.exports = mongoose.model('order', OrderSchema)