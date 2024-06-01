const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');

router.get('/', verifyToken, isUser, (req, res) => {
    /* #swagger.summary = 'Gets the list of orders' */
    /* #swagger.tags = ['Orders'] */
    ordersController.getOrders(req, res);
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

module.exports = router;
