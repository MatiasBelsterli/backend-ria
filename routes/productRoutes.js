const express = require('express');
const multer = require('multer');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

router.post('/', verifyToken, isAdmin, upload.single('image'), (req, res) => {
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

router.put('/:id', verifyToken, isAdmin, upload.single('image'), (req, res) => {
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

router.post('/:productId/ingredients', isAdmin, (req, res) => {
  /* #swagger.summary = 'Adds an ingredient to a product' */
  /* #swagger.tags = ['Products'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['productId'] = { description: 'Product ID', type: 'integer', required: true } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Ingredient information',
        schema: { $ref: '#/definitions/Ingredient' }
    } */
  productsController.addIngredientToProduct(req, res);
});

router.put('/:productId/ingredients/:supplyId', isAdmin, (req, res) => {
  /* #swagger.summary = 'Updates an ingredient in a product' */
  /* #swagger.tags = ['Products'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['productId'] = { description: 'Product ID', type: 'integer', required: true } */
  /* #swagger.parameters['supplyId'] = { description: 'Supply ID', type: 'integer', required: true } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated ingredient information',
        schema: { $ref: '#/definitions/Ingredient' }
    } */
  productsController.updateIngredientInProduct(req, res);
});

router.delete('/:productId/ingredients/:supplyId', isAdmin, (req, res) => {
  /* #swagger.summary = 'Removes an ingredient from a product' */
  /* #swagger.tags = ['Products'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['productId'] = { description: 'Product ID', type: 'integer', required: true } */
  /* #swagger.parameters['supplyId'] = { description: 'Supply ID', type: 'integer', required: true } */
  productsController.removeIngredientFromProduct(req, res);
});

module.exports = router;
