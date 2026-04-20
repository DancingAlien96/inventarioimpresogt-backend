import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from './models/Usuario.js';

// Script para crear los usuarios iniciales
async function crearUsuarios() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existen usuarios
    const usuariosExistentes = await Usuario.countDocuments();
    if (usuariosExistentes > 0) {
      console.log('ℹ️  Los usuarios ya existen, no se crearán duplicados');
      process.exit(0);
    }

    // Usuario 1: Cristofer
    const usuario1 = new Usuario({
      nombre: 'Cristofer Perez',
      email: 'cristoferperez65@impresogt.com',
      password: '1996Cr1st0f3r'
    });
    await usuario1.save();
    console.log('✅ Usuario Cristofer creado');

    // Usuario 2: Diego (Socio)
    const usuario2 = new Usuario({
      nombre: 'Diego Calderon',
      email: 'diegocalderon@impresogt.com',
      password: 'comida4'
    });
    await usuario2.save();
    console.log('✅ Usuario Diego creado');

    console.log('\n🎉 Usuarios creados exitosamente!');
    console.log('\nCredenciales:');
    console.log('Usuario 1: cristoferperez65@impresogt.com / 1996Cr1st0f3r');
    console.log('Usuario 2: diegocalderon@impresogt.com / comida4');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

crearUsuarios();
