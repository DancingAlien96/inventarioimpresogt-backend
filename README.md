# Backend - Sistema de Inventario ImpresoGT

API REST para gestión de inventario con autenticación JWT.

## 🚀 Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- bcryptjs para encriptación de passwords

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración

Crea o edita el archivo `.env` con tus credenciales:

```env
MONGODB_URI=mongodb+srv://impresogt:<TU_PASSWORD>@inventario.0xwrs04.mongodb.net/?appName=inventario
JWT_SECRET=cambia_este_secreto_por_uno_muy_seguro
PORT=5000
NODE_ENV=development
```

**IMPORTANTE:** Reemplaza `<TU_PASSWORD>` con la contraseña real de tu base de datos MongoDB.

## 🎯 Uso

### Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor correrá en `http://localhost:5000`

### Iniciar en producción:

```bash
npm start
```

### Crear usuarios iniciales:

**¡Los usuarios se crean automáticamente!** Cuando inicies el servidor por primera vez, se crearán estos usuarios:

**Usuario 1 (Cristofer):**
- Email: `cristoferperez65@impresogt.com`
- Password: `1996Cr1st0f3r`

**Usuario 2 (Diego):**
- Email: `diegocalderon@impresogt.com`
- Password: `comida4`

Si necesitas recrearlos manualmente, ejecuta:

```bash
npm run init-usuarios
```

## 🔧 Endpoints de la API

### Autenticación

- **POST** `/api/auth/registro`
  ```json
  {
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/login`
  ```json
  {
    "email": "juan@example.com",
    "password": "password123"
  }
  ```
  Retorna: `{ token, usuario: { id, nombre, email } }`

### Productos (requieren token)

- **GET** `/api/productos` - Listar todos
- **GET** `/api/productos/:id` - Obtener uno
- **POST** `/api/productos` - Crear
  ```json
  {
    "nombre": "Papel A4",
    "cantidad": 100,
    "precioCompra": 50,
    "precioVenta": 75,
    "categoria": "Papel",
    "stockMinimo": 10
  }
  ```
- **PUT** `/api/productos/:id` - Actualizar
- **DELETE** `/api/productos/:id` - Eliminar
- **GET** `/api/productos/alertas/bajo-stock` - Productos con stock <= stockMinimo

### Movimientos (requieren token)

- **GET** `/api/movimientos` - Listar todos (últimos 100)
- **POST** `/api/movimientos` - Crear movimiento
  ```json
  {
    "tipo": "Entrada",
    "producto": "product_id_here",
    "cantidad": 50,
    "nota": "Compra al proveedor X"
  }
  ```
- **GET** `/api/movimientos/producto/:productoId` - Movimientos de un producto

## 🔐 Autenticación

Todas las rutas de productos y movimientos requieren un token JWT. Inclúyelo en el header:

```
Authorization: Bearer <tu_token>
```

El token se obtiene al hacer login y tiene una duración de 7 días.

## 🗄️ Modelos

### Usuario
```javascript
{
  nombre: String,
  email: String (único),
  password: String (hasheado),
  timestamps: true
}
```

### Producto
```javascript
{
  nombre: String,
  cantidad: Number,
  precioCompra: Number,
  precioVenta: Number,
  categoria: String (enum),
  stockMinimo: Number,
  timestamps: true
}
```

### Movimiento
```javascript
{
  tipo: String (Entrada/Salida),
  producto: ObjectId (ref: Producto),
  cantidad: Number,
  nota: String,
  usuario: ObjectId (ref: Usuario),
  timestamps: true
}
```

## 🐛 Troubleshooting

**No puedo conectarme a MongoDB:**
- Verifica que tu contraseña sea correcta
- Asegúrate de que tu IP esté en la lista blanca de MongoDB Atlas (o usa 0.0.0.0/0 para permitir todas)
- Revisa que la URI de conexión sea correcta

**Error: usuarios duplicados:**
- Los usuarios solo se crean una vez automáticamente
- Si ya existen, el servidor no intentará crearlos de nuevo
- Los usuarios existen en la base de datos y puedes usarlos para login

## 🚀 Despliegue en Producción

Ver el archivo [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones detalladas de cómo desplegar en Render.com y otras plataformas.
