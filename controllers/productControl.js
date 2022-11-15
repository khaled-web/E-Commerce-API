//importingProduct
const Product = require('../models/product')
//ActivateStatusCodes
const {
 StatusCodes
} = require('http-status-codes')
//CustomError
const CustomError = require('../errors')
//path-package
const path = require('path');

//function_createProduct
const createProduct = async (req, res) => {
 req.body.user = req.user.userId;
 const product = await Product.create(req.body)
 res.status(StatusCodes.CREATED).json({
  product
 })
}

//function_getAllProduct
const getAllProduct = async (req, res) => {
 //schemaData
 const products = await Product.find({})
 //response
 res.status(StatusCodes.OK).json({
  count: products.length,
  products
 })

}

//function_getSingleProduct
const getSingleProduct = async (req, res) => {
 //whereIGetTheData
 const {
  id: productId
 } = req.params;
 //SchemaData
 const product = await Product.findOne({
  _id: productId
 }).populate('reviews')
 //inCaseOfNoIdProduct
 if (!product) {
  throw new CustomError.NotFoundError(`No product with id: ${productId}`)
 }
 //response
 res.status(StatusCodes.OK).json({
  product
 })
}

//function_updateProduct
const updateProduct = async (req, res) => {
 //Getting Data
 const {
  id: productId
 } = req.params;
 //schema
 const product = await Product.findOneAndUpdate({
  _id: productId
 }, req.body, {
  new: true,
  runValidators: true
 })
 //IfProductIsNotFound
 if (!product) {
  throw new CustomError.NotFoundError(`No product with id:${productId}`)
 }
 //response
 res.status(StatusCodes.OK).json({
  product
 })
}

//function_deleteProduct
const deleteProduct = async (req, res) => {
 //Getting Data
 const {
  id: productId
 } = req.params;
 //schema
 const product = await Product.findByIdAndRemove({
  _id: productId
 })
 //IfProductIsNotFound
 if (!product) {
  throw new CustomError.NotFoundError(`No product with id:${productId}`)
 }

 //sureRemovedProduct
 await product.remove();
 //response
 res.status(StatusCodes.OK).json({
  msg: "Success, Product Removed...:)"
 })
}

//function_uploadImage
const uploadImage = async (req, res) => {
 //check if files existing
 if (!req.files) {
  throw new CustomError.BadRequestError('No file Uploaded')
 }
 //select the imagePath
 const productImage = req.files.image;
 //if imagePath isn't right
 if (!productImage.mimetype.startsWith('image')) {
  throw new CustomError.BadRequestError('Please upload image!!')
 }
 //select imageSize
 const maxSize = 1024 * 1024;
 //if imageSize is bigger than maxSize
 if (productImage > maxSize) {
  throw new CustomError.BadRequestError('Please upload image smaller than 1MB')
 }
 const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
 await productImage.mv(imagePath)
 res.status(StatusCodes.OK).json({
  image: `/uploads/${productImage.name}`
 });
}

//exportingFunctions
module.exports = {
 createProduct,
 getAllProduct,
 getSingleProduct,
 updateProduct,
 deleteProduct,
 uploadImage
}