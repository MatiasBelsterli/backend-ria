const express = require('express');
const router = express.Router();
const suppliesController = require('../controllers/suppliesController');
const { verifyToken, isAdmin} = require('../middleware/auth');

router.get('/', verifyToken, (req, res) => {
    /* #swagger.summary = 'Retrieves all supplies' */
    /* #swagger.tags = ['Supplies'] */
    suppliesController.getSupplies(req, res);
});

router.get('/:id', verifyToken, (req, res) => {
    /* #swagger.summary = 'Retrieves a supply by ID' */
    /* #swagger.tags = ['Supplies'] */
    /* #swagger.parameters['id'] = { description: 'Supply ID', type: 'integer', required: true } */
    suppliesController.getSupplyById(req, res);
});

router.post('/', verifyToken, isAdmin, (req, res) => {
    /* #swagger.summary = 'Creates a new supply' */
    /* #swagger.tags = ['Supplies'] */
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Supply information',
          schema: { $ref: '#/definitions/Supply' }
      } */
    suppliesController.createSupply(req, res);
});

router.put('/:id', verifyToken, isAdmin, (req, res) => {
    /* #swagger.summary = 'Updates an existing supply' */
    /* #swagger.tags = ['Supplies'] */
    /* #swagger.parameters['id'] = { description: 'Supply ID', type: 'integer', required: true } */
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Updated supply information',
          schema: { $ref: '#/definitions/Supply' }
      } */
    suppliesController.updateSupply(req, res);
});

router.delete('/:id', verifyToken, isAdmin, (req, res) => {
    /* #swagger.summary = 'Deletes a supply by ID' */
    /* #swagger.tags = ['Supplies'] */
    /* #swagger.parameters['id'] = { description: 'Supply ID', type: 'integer', required: true } */
    suppliesController.deleteSupply(req, res);
});

module.exports = router;