import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Usuario from './models/Usuario.js';

dotenv.config();

const app = express();

// Middlewares
const allowedOrigins = [
  'https://inventarioimpresogt-frontend.vercel.app', // Cambia esto por tu dominio real de Vercel
  'http://localhost:3000'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Función para crear usuarios por defecto
async function crearUsuariosDefecto() {
  try {
    const usuariosExistentes = await Usuario.countDocuments();
    
    if (usuariosExistentes === 0) {
      console.log('📝 Creando usuarios por defecto...');
      
      // Usuario 1: Cristofer
      const usuario1 = new Usuario({
        nombre: 'Cristofer Perez',
        email: 'cristoferperez65@impresogt.com',
        password: '1996Cr1st0f3r'
      });
      await usuario1.save();
      console.log('✅ Usuario Cristofer creado');

      // Usuario 2: Diego
      const usuario2 = new Usuario({
        nombre: 'Diego Calderon',
        email: 'diegocalderon@impresogt.com',
        password: 'comida4'
      });
      await usuario2.save();
      console.log('✅ Usuario Diego creado');
      
      console.log('🎉 Usuarios por defecto creados exitosamente');
    } else {
      console.log('ℹ️  Usuarios ya existen en la base de datos');
    }
  } catch (error) {
    console.error('⚠️  Error al crear usuarios por defecto:', error.message);
  }
}

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Conectado a MongoDB');
    // Crear usuarios por defecto después de conectar
    await crearUsuariosDefecto();
  })
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas
import authRoutes from './routes/auth.js';
import productoRoutes from './routes/productos.js';
import movimientoRoutes from './routes/movimientos.js';
import trabajoRoutes from './routes/trabajos.js';

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/compras', movimientoRoutes);
app.use('/api/ventas', trabajoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Inventario ImpresoGT funcionando' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
