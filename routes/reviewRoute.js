//express-package
const express = require('express');
const router = express.Router();
//middleware-Authentication
const {
 authenticateUser
} = require('../middleware/authentication')

//importingControllers-function
const {
 createReview,
 getAllReview,
 getSingleReview,
 updateReview,
 deleteReview
} = require('../controllers/reviewController');

//route
router.route('/').post(authenticateUser, createReview).get(getAllReview);
router.route('/:id').get(getSingleReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview)

//exporting router
module.exports = router;