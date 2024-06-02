const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken, isUser } = require('../middleware/auth');

router.get('/', verifyToken, isUser, (req, res) => {
    /* #swagger.summary = 'Gets the cart for the user' */
    /* #swagger.tags = ['Cart'] */
    cartController.getCart(req, res);
});

router.post('/', verifyToken, isUser, (req, res) => {
    /* #swagger.summary = 'Adds a product to the cart' */
    /* #swagger.tags = ['Cart'] */
    cartController.addProduct(req, res);
});

router.put('/:productId', verifyToken, isUser, (req, res) => {
    /* #swagger.summary = 'Updates the quantity of a product in the cart' */
    /* #swagger.tags = ['Cart'] */
    cartController.updateProductQuantity(req, res);
});

router.delete('/:productId', verifyToken, isUser, (req, res) => {
    /* #swagger.summary = 'Removes a product from the cart' */
    /* #swagger.tags = ['Cart'] */
    cartController.removeProduct(req, res);
});

router.delete('/', verifyToken, isUser, (req, res) => {
    /* #swagger.summary = 'Clears the cart' */
    /* #swagger.tags = ['Cart'] */
    cartController.clearCart(req, res);
});

module.exports = router;
