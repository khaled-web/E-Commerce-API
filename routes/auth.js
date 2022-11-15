//express-package
const express = require('express');
const router = express.Router();
//importingControllers-function
const {
 register,
 login,
 logout
} = require('../controllers/auth');

//routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

//exportsRouter
module.exports = router;