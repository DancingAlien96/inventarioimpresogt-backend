# Deployment en Render.com

Este proyecto está configurado para desplegarse automáticamente en Render.com

## Configuración Automática

El servidor está configurado para:
1. ✅ Crear automáticamente 2 usuarios por defecto al iniciar (si no existen)
2. ✅ Conectarse a MongoDB Atlas
3. ✅ Configurar CORS para el frontend

## Usuarios por Defecto

Cuando el servidor inicie por primera vez, se crearán automáticamente:

**Usuario 1 (Cristofer):**
- Email: `cristoferperez65@impresogt.com`
- Password: `1996Cr1st0f3r`

**Usuario 2 (Diego):**
- Email: `diegocalderon@impresogt.com`  
- Password: `comida4`

## Pasos para Desplegar en Render

### 1. Preparar el Backend

1. Sube tu código a GitHub/GitLab
2. Ve a [Render.com](https://render.com) y crea una cuenta
3. Click en "New +" → "Web Service"
4. Conecta tu repositorio

### 2. Configuración en Render

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**Environment Variables** (agregar en Render):
```
MONGODB_URI=mongodb+srv://impresogt:<TU_PASSWORD>@inventario.0xwrs04.mongodb.net/?appName=inventario
JWT_SECRET=un_secreto_super_seguro_y_aleatorio_para_produccion
PORT=5000
NODE_ENV=production
```

### 3. Desplegar el Frontend en Vercel

1. Ve a [Vercel.com](https://vercel.com)
2. Importa el proyecto frontend
3. Configura la variable de entorno:

```
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api
```

### 4. Configurar CORS en el Backend

Si tu frontend está en un dominio diferente, actualiza el CORS en `server.js`:

```javascript
app.use(cors({
  origin: ['https://tu-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

## Notas Importantes

- Los usuarios se crean **automáticamente** la primera vez que el servidor inicia
- Si ya existen usuarios, NO se crearán duplicados
- Las contraseñas están hasheadas en la base de datos
- Cambia el `JWT_SECRET` a algo seguro y aleatorio en producción

## Verificar que Funcione

Una vez desplegado, visita:
```
https://tu-backend.onrender.com/
```

Deberías ver: `{ "message": "API de Inventario ImpresoGT funcionando" }`

## Solución de Problemas

**Error de conexión a MongoDB:**
- Verifica que la contraseña en `MONGODB_URI` sea correcta
- Asegúrate de que la IP de Render esté permitida en MongoDB Atlas (0.0.0.0/0)

**Usuarios no se crean:**
- Revisa los logs en Render
- Verifica que la conexión a MongoDB sea exitosa

**CORS Error:**
- Agrega la URL de tu frontend a la configuración de CORS
