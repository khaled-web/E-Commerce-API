//schema-review
const Review = require('../models/review')
const Product = require('../models/product')
//CustomError
const CustomError = require('../errors');
//utils-createTokenUser
const {
 checkPermissions
} = require('../utils')
//ActivateHttp-status-codes
const {
 StatusCodes
} = require('http-status-codes');


//createReview_Function
const createReview = async (req, res) => {
 //gettingDataRegardingProductData
 const {
  product: productId
 } = req.body;
 //CheckIfProductDataIsValid
 const isValidProduct = await Product.findOne({
  _id: productId
 })
 if (!isValidProduct) {
  throw new CustomError.NotFoundError(`No product with id: ${productId}`)
 }
 //checkForSubmittedReviewDependOnProduct
 const alreadySubmitted = await Review.findOne({
  product: productId,
  user: req.user.userId
 })

 if (alreadySubmitted) {
  throw new CustomError.BadRequestError('Already Submitted review for this product...')
 }

 req.body.user = req.user.userId;
 //creatingReviewOnMongoDB
 const review = await Review.create(req.body)
 res.status(StatusCodes.CREATED).json({
  review
 })
}


//getAllReview_Function
const getAllReview = async (req, res) => {
 //GettingDataBySchemaOptions
 const reviews = await Review.find({}).populate({
  path: 'product',
  select: 'name company price'
 }).populate({
  path: 'user',
  select: 'name'
 })
 //Response
 res.status(StatusCodes.OK).json({
  count: reviews.length,
  reviews
 });
}


//getSingleReview_Function
const getSingleReview = async (req, res) => {
 //GettingDataFromParams
 const {
  id: reviewId
 } = req.params;
 //GettingDataByUsingSchemaOption
 const review = await Review.findOne({
  _id: reviewId
 }).populate({
  path: 'product',
  select: 'name company price'
 }).populate({
  path: 'user',
  select: 'name'
 })
 //CheckIfThereAreNoReview
 if (!review) {
  throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
 }
 res.status(StatusCodes.OK).json({
  review
 });
}


//updateReview_Function
const updateReview = async (req, res) => {
 const {
  id: reviewId
 } = req.params;
 const {
  rating,
  title,
  comment
 } = req.body;
 const review = await Review.findOne({
  _id: reviewId
 })
 if (!review) {
  throw new CustomError.NotFoundError('No review with id: ${reviewId')
 }
 checkPermissions(req.user, review.user);
 review.rating = rating;
 review.title = title;
 review.comment = comment;
 await review.save();
 res.status(StatusCodes.OK).json({
  review
 });
}


//deleteReview_Function
const deleteReview = async (req, res) => {
 const {
  id: reviewId
 } = req.params;
 const review = await Review.findOne({
  _id: reviewId
 })
 if (!review) {
  throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
 }
 checkPermissions(req.user, review.user)
 await review.remove()
 res.status(StatusCodes.OK).json({
  msg: 'Success! Review removed'
 })
}

const getSingleProductReviews = async (req, res) => {
 const {
  id: productId
 } = req.params;
 const reviews = await Review.find({
  product: productId
 })
 res.status(StatusCodes.OK).json({
  count: reviews.length,
  reviews
 })
}


//exportingControllerFunctions
module.exports = {
 createReview,
 getAllReview,
 getSingleReview,
 updateReview,
 deleteReview,
 getSingleProductReviews
}