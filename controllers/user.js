//importing userSchema
const User = require('../models/user');
//StatusCodes-package
const StatusCodes = require('http-status-codes')
//CustomError
const CustomError = require('../errors');
//utils-createTokenUser
const {
 createTokenUser,
 attachCookiesToResponse,
 checkPermissions
} = require('../utils')





//function-getAllUsers
const getAllUsers = async (req, res) => {
 console.log(req.user)
 //useSchema-find
 const users = await User.find({
  role: 'user'
 }).select('-password')
 //response
 res.status(StatusCodes.OK).json({
  count: users.length,
  users
 })
}




//functions-getSingleUser
const getSingleUser = async (req, res) => {
 //GettingData
 const {
  id: userId
 } = req.params;
 //useSchema-method
 const user = await User.findOne({
  _id: userId
 }).select('-password')
 //ifUserNotFound
 if (!user) {
  throw new CustomError.NotFoundError(`No user with id: ${userId}`)
 }
 //checkPermission
 checkPermissions(req.user, user._id)
 //Response
 res.status(StatusCodes.OK).json({
  user
 })
}



//function-showCurrentUser
const showCurrentUser = async (req, res) => {
 res.status(StatusCodes.OK).json({
  user: req.user
 })
}



//function-updateUserWithUser.save()
const updateUser = async (req, res) => {
 //gettingData
 const {
  email,
  name
 } = req.body;
 //incase of missing email or password
 if (!email || !name) {
  throw new CustomError.BadRequestError('Please Provide All Values.')
 }
 //updateDataByUsingSchema
 const user = await User.findOne({
  _id: req.user.userId
 })
 user.email = email;
 user.name = name;
 await user.save();
 //updateToken,cookies
 const tokenUser = createTokenUser(user);
 attachCookiesToResponse({
  res,
  user: tokenUser
 })
 //Response
 res.status(StatusCodes.OK).json({
  user: tokenUser
 })
}

// //function-updateUserWithFindOneAndUpdate
// const updateUser = async (req, res) => {
//  //gettingData
//  const {
//   email,
//   name
//  } = req.body;
//  //incase of missing email or password
//  if (!email || !name) {
//   throw new CustomError.BadRequestError('Please Provide All Values.')
//  }
//  //updateDataByUsingSchema
//  const user = await User.findOneAndUpdate({
//   _id: req.user.userId
//  }, {
//   email,
//   name
//  }, {
//   new: true,
//   runValidators: true
//  })
//  //updateToken,cookies
//  const tokenUser = createTokenUser(user);
//  attachCookiesToResponse({
//   res,
//   user: tokenUser
//  })
//  //Response
//  res.status(StatusCodes.OK).json({
//   user: tokenUser
//  })
// }




//function-updateUserPassword
const updateUserPassword = async (req, res) => {
 const {
  oldPassword,
  newPassword
 } = req.body;

 if (!oldPassword || !newPassword) {
  throw new CustomError.BadRequestError('Please provide both values!!!')
 }
 //getUserBySchema
 const user = await User.findOne({
  _id: req.user.userId
 })
 //comparingPassword
 const isPasswordCorrect = await user.comparePassword(oldPassword)
 //checkThePassword
 if (!isPasswordCorrect) {
  throw new CustomError.UnauthenticatedError('Invalid Credentials')
 }
 //saveThePassword
 user.password = newPassword;
 await user.save();
 //response
 res.status(StatusCodes.OK).json({
  msg: 'Success!!! Password Updated:):):)'
 })
}

//export the function
module.exports = {
 getAllUsers,
 getSingleUser,
 showCurrentUser,
 updateUser,
 updateUserPassword
}