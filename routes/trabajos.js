import express from 'express';
import Trabajo from '../models/Trabajo.js';
import Producto from '../models/Producto.js';
import { verificarToken } from '../middleware/auth.js';
import { sendTelegramNotification } from '../services/telegramService.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener todos los trabajos
router.get('/', async (req, res) => {
  try {
    const trabajos = await Trabajo.find()
      .populate('materiales.producto', 'nombre')
      .populate('usuario', 'nombre')
      .sort({ createdAt: -1 });
    
    // Agregar cálculos de ganancia
    const trabajosConGanancia = trabajos.map(trabajo => ({
      ...trabajo.toObject(),
      ganancia: trabajo.ganancia(),
      porcentajeGanancia: trabajo.porcentajeGanancia()
    }));
    
    res.json(trabajosConGanancia);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener trabajos', error: error.message });
  }
});

// Obtener un trabajo por ID
router.get('/:id', async (req, res) => {
  try {
    const trabajo = await Trabajo.findById(req.params.id)
      .populate('materiales.producto')
      .populate('usuario', 'nombre');
    
    if (!trabajo) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }
    
    res.json({
      ...trabajo.toObject(),
      ganancia: trabajo.ganancia(),
      porcentajeGanancia: trabajo.porcentajeGanancia()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener trabajo', error: error.message });
  }
});

// Crear trabajo
router.post('/', async (req, res) => {
  try {
    const trabajo = new Trabajo({
      ...req.body,
      usuario: req.userId
    });
    
    await trabajo.save();
    await trabajo.populate('materiales.producto', 'nombre');
    await trabajo.populate('usuario', 'nombre');
    
    await sendTelegramNotification(`✅ Se ha hecho una nueva venta. Revisa en el link ya proporcionado.`);
    res.status(201).json({
      ...trabajo.toObject(),
      ganancia: trabajo.ganancia(),
      porcentajeGanancia: trabajo.porcentajeGanancia()
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear trabajo', error: error.message });
  }
});

// Actualizar trabajo
router.put('/:id', async (req, res) => {
  try {
    const trabajo = await Trabajo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('materiales.producto', 'nombre')
     .populate('usuario', 'nombre');
    
    if (!trabajo) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }
    
    await sendTelegramNotification(`✅ Se ha hecho una nueva venta. Revisa en el link ya proporcionado.`);
    
    res.json({
      ...trabajo.toObject(),
      ganancia: trabajo.ganancia(),
      porcentajeGanancia: trabajo.porcentajeGanancia()
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar trabajo', error: error.message });
  }
});

// Eliminar trabajo
router.delete('/:id', async (req, res) => {
  try {
    const trabajo = await Trabajo.findByIdAndDelete(req.params.id);
    if (!trabajo) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }
    await sendTelegramNotification(`✅ Se ha hecho una nueva venta. Revisa en el link ya proporcionado.`);
    res.json({ message: 'Trabajo eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar trabajo', error: error.message });
  }
});

// Obtener estadísticas de trabajos
router.get('/estadisticas/resumen', async (req, res) => {
  try {
    const trabajos = await Trabajo.find({ estado: { $in: ['Completado', 'Entregado'] } });
    
    const totalVentas = trabajos.reduce((sum, t) => sum + t.precioVenta, 0);
    const totalCostos = trabajos.reduce((sum, t) => sum + t.costoProduccion, 0);
    const totalGanancias = totalVentas - totalCostos;
    
    res.json({
      totalTrabajos: trabajos.length,
      totalVentas,
      totalCostos,
      totalGanancias,
      margenPromedio: totalCostos > 0 ? (totalGanancias / totalCostos) * 100 : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
});

export default router;
