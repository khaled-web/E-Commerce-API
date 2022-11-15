//importingErrors
const customErr = require('../errors');
//importingIsTokenValid
const {
 isTokenValid
} = require('../utils')
//AuthenticateUser-function
const authenticateUser = async (req, res, next) => {
 const token = req.signedCookies.token;
 if (!token) {
  throw new customErr.UnauthenticatedError('Authentication Invalid')
 }

 try {
  const {
   name,
   userId,
   role
  } = isTokenValid({
   token
  })

  req.user = {
   name,
   userId,
   role
  }
  next();
 } catch (error) {
  throw new customErr.UnauthenticatedError('Authentication Invalid')
 }
}

//authorizePermissions-Function(userAdmin)
const authorizePermission = (...roles) => { //toAddNewMember(notAtSchema)
 return (req, res, next) => {
  if (!roles.includes(req.user.role)) {
   throw new customErr.UnauthenticatedError('Unauthorized to access this route');
  }
  next();
 }

}



module.exports = {
 authenticateUser,
 authorizePermission
};