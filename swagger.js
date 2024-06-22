const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Documentación',
    description: 'Documentación de la API generada automáticamente',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Ingrese su token en el formato: Bearer <token>'
    }
  },
    definitions: {
        Hospital: {
            id: 1,
            nombre: "Hospital Central",
            direccion: "Av. Principal 123",
        },
        Usuario: {
            id: 1,
            email: "user@example.com",
            password: "password123",
            role: "USER",
            telefono: "123456789",
            enabled: true
        },
        RegisterUser: {
            email: "user@example.com",
            password: "password123",
            role: "USER",
            telefono: "123456789",
        },
        Login: {
            email: "user@example.com",
            password: "password123",
        },
        ChangePassword: {
            id: 1,
            oldPassword: "password123",
            newPassword: "newpassword123",
        },
        ForgotPassword: {
            email: "user@example.com",
        },
        EnableDisableUser: {
            id: 1,
        },
        Producto: {
            id: 1,
            nombre: "Producto Ejemplo",
            descripcion: "Descripción del producto",
            imagen: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
            precio: 9.99
        },
        Supply: {
            type: "object",
            properties: {
                id: { type: "integer", example: 1 },
                name: { type: "string", example: "Flour" },
                unit: { type: "string", example: "grams" },
                price: { type: "number", example: 0.05 }
            }
        },
        Ingredient: {
            type: "object",
            properties: {
                supplyId: { type: "integer", example: 1 },
                quantity: { type: "number", example: 500 }
            }
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app');
});
