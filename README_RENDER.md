# Despliegue en Render (Node.js, sin Docker)

Este backend está listo para desplegarse en Render usando el entorno Node.js (NO Docker).

## Pasos rápidos:

1. **Crea un nuevo servicio Web en Render**
   - **Type:** Web Service
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** (vacío, si el package.json está en la raíz)

2. **Variables de entorno:**
   - MONGODB_URI
   - JWT_SECRET
   - PORT (opcional, Render usa 10000+ por defecto)

3. **No necesitas Dockerfile.**

4. **CORS ya está configurado para Vercel y localhost.**

---

Si Render te pide Dockerfile, elimina el servicio y créalo de nuevo como Node.

---

## Scripts package.json
- `start`: node server.js
- `dev`: node --watch server.js

---

¿Dudas? github.com/DancingAlien96/inventarioimpresogt-backend/issues
