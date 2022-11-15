//mongoose-package
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//validator-package
const validator = require('validator');
//JWT-Package
const jwt = require('jsonwebtoken');
//UserSchema
const UserSchema = new mongoose.Schema({
 name: {
  type: String,
  required: [true, 'Please provide name'],
  minLength: 3,
  maxLength: 50
 },

 email: {
  type: String,
  unique: true, //To stop Duplicate email
  required: [true, 'Please provide email'],
  validate: {
   validator: validator.isEmail,
   message: 'Please provide valid email'
  }
 },

 password: {
  type: String,
  required: [true, 'Please provide password'],
  minLength: 6,
 },

 role: {
  type: String,
  enum: ['admin', 'user'],
  default: 'user'
 }
});
//HashingPassword
UserSchema.pre('save', async function (next) {
 // console.log(this.modifiedPaths()) //toShowUsWhatWeChange!!!
 // console.log(this.isModified('name'))
 if (!this.isModified('password')) return;
 const salt = await bcrypt.genSalt(10)
 this.password = await bcrypt.hash(this.password, salt)
 next();
})
//comparePassword(login)
UserSchema.methods.comparePassword = async function (pass) {
 const isMatch = await bcrypt.compare(pass, this.password);
 return isMatch;
}
//CreatingJWT
UserSchema.methods.createJWT = function () {
 return jwt.sign({
  userId: this._id,
  name: this.name,
  role: this.role
 }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_LIFETIME
 })
}

//exportingSchema
module.exports = mongoose.model('User', UserSchema);