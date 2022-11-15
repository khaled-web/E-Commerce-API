//express-package
const express = require('express');
const router = express.Router();

const {
 authenticateUser,
 authorizePermission
} = require('../middleware/authentication')

//importingControllers-function
const {
 createProduct,
 getAllProduct,
 getSingleProduct,
 updateProduct,
 deleteProduct,
 uploadImage
} = require('../controllers/productControl');

const {
 getSingleProductReviews
} = require('../controllers/reviewController')
//route
router.route('/').post([authenticateUser, authorizePermission('admin')], createProduct).get(getAllProduct)

router.route('/uploadImage').post([authenticateUser, authorizePermission('admin')], uploadImage)

router.route('/:id').get(getSingleProduct).patch([authenticateUser, authorizePermission('admin')], updateProduct).delete([authenticateUser, authorizePermission('admin')], deleteProduct)

router.route('/:id/reviews').get(getSingleProductReviews)

//exporting router
module.exports = router;