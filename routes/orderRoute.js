//express-package
const express = require('express');
const router = express.Router();
const {
 authenticateUser,
 authorizePermission
} = require('../middleware/authentication')
//importingControllers-function
const {
 getAllOrders,
 getSingleOrder,
 getCurrentUserOrders,
 CreateOrder,
 updateOrder
} = require('../controllers/orderController');

//routes
router.route('/').post(authenticateUser, CreateOrder).get(authenticateUser, authorizePermission('admin'), getAllOrders);

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);

router.route('/:id').get(authenticateUser, getSingleOrder).patch(authenticateUser, updateOrder);

//exporting router
module.exports = router;