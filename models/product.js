const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
 name: {
  type: String,
  trim: true,
  required: [true, 'Please provide product name'],
  maxLength: [100, 'Name can not be more than 100 characters']
 },

 price: {
  type: Number,
  required: [true, 'Please provide product price'],
  default: 0
 },

 description: {
  type: String,
  trim: true,
  required: [true, 'Please provide product description'],
  maxLength: [1000, 'Description can not be more than 1000 characters']
 },

 image: {
  type: String,
  default: '/uploads/example.jpeg'
 },

 category: {
  type: String,
  required: [true, 'Please provide product category'],
  enum: ['office', 'kitchen', 'bedroom']
 },

 company: {
  type: String,
  trim: true,
  required: [true, 'Please provide product company'],
  enum: {
   values: ['ikea', 'liddy', 'marcos'],
   message: '{VALUE} is not supported'
  }
 },

 colors: {
  type: [String],
  default: ['#222'],
  required: true
 },

 featured: {
  type: Boolean,
  default: false
 },

 freeShipping: {
  type: Boolean,
  default: false
 },

 inventory: {
  type: Number,
  required: true,
  default: 15
 },

 averageRating: {
  type: Number,
  default: 0
 },

 numOfReviews: {
  type: Number,
  default: 0
 },

 user: {
  type: mongoose.Types.ObjectId,
  ref: 'User',
  required: true
 }

}, {
 timestamps: true,
 toJSON: { //To user data from reviews to product"populate"
  virtuals: true
 },
 toObject: { //To user data from reviews to product"populate"
  virtuals: true
 }

})
//toActiveThePopulate
ProductSchema.virtual('reviews', {
 ref: "Review",
 localField: '_id',
 foreignField: 'product',
 justOne: false,
 // match: {  //to select only product with rating equal...5
 //  rating: 5
 // }
})

//removeAllReviewsRegardingTheDeletingProduct
ProductSchema.pre('remove', async function (next) {
 await this.model('Review').deleteMany({
  product: this._id
 })
})

//exportingProductSchema
module.exports = mongoose.model('Product', ProductSchema)