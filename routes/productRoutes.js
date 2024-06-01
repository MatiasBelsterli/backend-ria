const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');

router.get('/', verifyToken, isUser, (req, res) => {
  /* #swagger.summary = 'Gets the list of products' */
  /* #swagger.tags = ['Products'] */
  productsController.getProducts(req, res);
});

router.get('/:id', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Gets a product by ID' */
  /* #swagger.tags = ['Products'] */
  /* #swagger.parameters['id'] = { description: 'Product ID', type: 'integer', required: true } */
  productsController.getProductById(req, res);
});

router.post('/', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Adds a new product' */
  /* #swagger.tags = ['Products'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new product.',
        schema: { $ref: '#/definitions/Product' }
    } */
  productsController.createProduct(req, res);
});

router.put('/:id', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Updates an existing product' */
  /* #swagger.tags = ['Products'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'Product ID', type: 'integer', required: true } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update product.',
        schema: { $ref: '#/definitions/Product' }
    } */
  productsController.updateProduct(req, res);
});

router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Deletes a product' */
  /* #swagger.tags = ['Products'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'Product ID', type: 'integer', required: true } */
  productsController.deleteProduct(req, res);
});

module.exports = router;
