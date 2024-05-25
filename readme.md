# API Sismtea de gestión de pedidos de panadería

Esta API permite gestionar los pedidos, los usuarios pueden tener roles de ADMIN, PANADERO y USER. Los usuarios pueden registrarse, iniciar sesión, cambiar contraseñas y más.

## Instalación

Para instalar y ejecutar esta API, sigue los siguientes pasos:

1. Clona este repositorio:
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    ```

2. Navega al directorio del proyecto:
    ```bash
    cd tu-repositorio
    ```

3. Instala las dependencias:
    ```bash
    npm install
    ```

4. Inicia el servidor:
    ```bash
    node swagger.js 
    ```
    Este comando inicia la api con la documentación de swagger. Si se quiere iniciar sin ella:
    ```bash
    node app.js 
    ```
## Ejemplo de Uso

### Registro de Usuario

Registra un nuevo usuario con los siguientes datos.

#### Ruta
`POST /usuarios/register`

#### Cuerpo de la Solicitud
```json
{
  "email": "usuario@example.com",
  "password": "tucontraseña",
  "telefono": "123456789",
  "rol": "USER"
}