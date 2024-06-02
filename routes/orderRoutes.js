const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const { verifyToken, isAdmin, isUser, isBaker } = require('../middleware/auth');

router.get('/', verifyToken, isUser, (req, res) => {
    /* #swagger.summary = 'Gets the list of orders' */
    /* #swagger.tags = ['Orders'] */
    ordersController.getOrders(req, res);
});

router.get('/bakers', verifyToken, isBaker, (req, res) => {
    /* #swagger.summary = 'Gets the list of orders to bakers' */
    /* #swagger.tags = ['Orders'] */
    ordersController.getOrdersToBakers(req, res);
});

router.patch('/bakers/:id', verifyToken, isBaker, (req, res) => {
    /* #swagger.summary = 'Accepts an order' */
    /* #swagger.tags = ['Orders'] */
    ordersController.takeOrderToBaker(req, res);
});

router.get('/baker', verifyToken, isBaker, (req, res) => {
    /* #swagger.summary = 'Gets an order to bakers by ID' */
    /* #swagger.tags = ['Orders'] */
    ordersController.getOrdersByBaker(req, res);
});

router.get('/:id', verifyToken, isUser, (req, res) => {
    /* #swagger.summary = 'Gets an order by ID' */
    /* #swagger.tags = ['Orders'] */
    ordersController.getOrderById(req, res);
});

router.post('/', verifyToken, isUser, (req, res) => {
    /* #swagger.summary = 'Creates a new order' */
    /* #swagger.tags = ['Orders'] */
    ordersController.createOrder(req, res);
});

router.put('/:id', verifyToken, isUser, (req, res) => {
    /* #swagger.summary = 'Updates an existing order' */
    /* #swagger.tags = ['Orders'] */
    ordersController.updateOrder(req, res);
});

router.delete('/:id', verifyToken, isAdmin, (req, res) => {
    /* #swagger.summary = 'Deletes an order by ID' */
    /* #swagger.tags = ['Orders'] */
    ordersController.deleteOrder(req, res);
});

router.patch('/:id/status', verifyToken, isUser, (req, res) => {
    /* #swagger.summary = 'Changes the status of an order' */
    /* #swagger.tags = ['Orders'] */
    ordersController.updateOrderStatus(req, res);
});

module.exports = router;
