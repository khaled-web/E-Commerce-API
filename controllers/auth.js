//importing userSchema
const User = require('../models/user');
//StatusCodes-package
const StatusCodes = require('http-status-codes')
//CustomError
const CustomError = require('../errors');
//utils
const {
 AttachCookiesToResponse,
 createTokenUser,
 attachCookiesToResponse
} = require('../utils')

//register-controllerFunction
const register = async (req, res) => {
 //ToStopDuplicateEmail
 const {
  email,
  name,
  password
 } = req.body;
 const emailAlreadyExists = await User.findOne({
  email
 })
 if (emailAlreadyExists) {
  throw new CustomError.BadRequestError('Email already exists')
 }
 //SetFirstRegisteredUserIsAdmin
 const isFirstAccount = await User.countDocuments({}) === 0;
 const role = isFirstAccount ? 'admin' : 'user';
 //CreateDataOnMongoDB
 const user = await User.create({
  name,
  email,
  password,
  role
 });
 //creating JWT
 const token = user.createJWT();
 //creatingCookie(name,value,option)
 const thirtyDay = 1000 * 60 * 60 * 24 * 30
 res.cookie('token', token, {
  httpOnly: true,
  expires: new Date(Date.now() + thirtyDay),
  secure: process.env.NODE_ENV === 'protection',
  signed: true
 })
 //response
 res.status(StatusCodes.CREATED).json({
  user: {
   name: user.name,
   userId: user._id,
   role: user.role
  }
 })
}

//login-controller
const login = async (req, res) => {
 //gettingInfo(email,password)
 const {
  email,
  password
 } = req.body;
 //(email,password)-notFound
 if (!email || !password) {
  throw new CustomError.BadRequestError('Please, provide email and password')
 }
 //usingSchema(findOut)
 const user = await User.findOne({
  email
 })
 //compare the Password
 if (!user) {
  throw new CustomError.UnauthenticatedError('Invalid Credentials')
 }
 //comparePassword
 const isPasswordCorrect = await user.comparePassword(password)
 if (!isPasswordCorrect) {
  throw new CustomError.UnauthenticatedError('Invalid Credentials')
 }
 //create JWT
 const tokenUser = createTokenUser(user);
 //creatingCookie(name,value,option)
 attachCookiesToResponse({
  res,
  user: tokenUser
 })
 //response
 res.status(StatusCodes.OK).json({
  user: tokenUser
 })
}

//logout-controller
const logout = async (req, res) => {
 //cancel the Cookie"Token"
 res.cookie('token', 'logout', {
  httpOnly: true,
  expires: new Date(Date.now() + 1000)
 })
 //response
 res.status(StatusCodes.OK).json({
  msg: 'user logged out!'
 })
}

//exporting functions-controller
module.exports = {
 register,
 login,
 logout
}