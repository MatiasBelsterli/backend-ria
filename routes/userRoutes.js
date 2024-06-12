const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usersController');
const multer = require("multer");
const {verifyToken} = require("../middleware/auth");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/register', upload.single('image'), (req, res) => {
  /* #swagger.summary = 'Registra un nuevo usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Registro de nuevo usuario.',
        schema: { $ref: '#/definitions/RegisterUser' }
    } */
  usuariosController.register(req, res);
});

router.put('/', verifyToken, upload.single('image'), (req, res) => {
  /* #swagger.summary = 'Edita la información de un usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Edición de usuario.',
        schema: { $ref: '#/definitions/EditUser' }
    } */
  usuariosController.editUser(req, res);
});

router.post('/login', (req, res) => {
  /* #swagger.summary = 'Inicia sesión' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Credenciales de usuario.',
        schema: { $ref: '#/definitions/Login' }
    } */
  usuariosController.login(req, res);
});

router.post('/change-password', (req, res) => {
  /* #swagger.summary = 'Cambia la contraseña del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Cambio de contraseña de usuario.',
        schema: { $ref: '#/definitions/ChangePassword' }
    } */
  usuariosController.changePassword(req, res);
});

router.post('/forgot-password', (req, res) => {
  /* #swagger.summary = 'Recupera la contraseña olvidada' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Recuperación de contraseña de usuario.',
        schema: { $ref: '#/definitions/ForgotPassword' }
    } */
  usuariosController.forgotPassword(req, res);
});

router.post('/enable-user', (req, res) => {
  /* #swagger.summary = 'Habilita un usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Habilitación de usuario.',
        schema: { $ref: '#/definitions/EnableDisableUser' }
    } */
  usuariosController.enableUser(req, res);
});

router.post('/disable-user', (req, res) => {
  /* #swagger.summary = 'Deshabilita un usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Deshabilitación de usuario.',
        schema: { $ref: '#/definitions/EnableDisableUser' }
    } */
  usuariosController.disableUser(req, res);
});

router.get('/:id', (req, res) => {
  /* #swagger.summary = 'Obtiene un usuario por ID' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del usuario.',
        required: true,
        type: 'integer'
    } */
  usuariosController.getUserById(req, res);
});

module.exports = router;
