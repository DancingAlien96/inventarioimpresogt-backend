import express from 'express';
import Movimiento from '../models/Movimiento.js';
import Producto from '../models/Producto.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener todos los movimientos
router.get('/', async (req, res) => {
  try {
    const movimientos = await Movimiento.find()
      .populate('producto', 'nombre')
      .populate('usuario', 'nombre')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener movimientos', error: error.message });
  }
});

// Crear movimiento (entrada o salida)
router.post('/', async (req, res) => {
  try {
    const { tipo, producto: productoId, cantidad, nota } = req.body;

    // Verificar que el producto existe
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizar cantidad del producto
    if (tipo === 'Entrada') {
      producto.cantidad += cantidad;
    } else if (tipo === 'Salida') {
      if (producto.cantidad < cantidad) {
        return res.status(400).json({ message: 'No hay suficiente stock' });
      }
      producto.cantidad -= cantidad;
    }

    await producto.save();

    // Crear el movimiento
    const movimiento = new Movimiento({
      tipo,
      producto: productoId,
      cantidad,
      nota,
      usuario: req.userId
    });

    await movimiento.save();
    await movimiento.populate('producto', 'nombre');
    await movimiento.populate('usuario', 'nombre');

    res.status(201).json(movimiento);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear movimiento', error: error.message });
  }
});

// Obtener movimientos de un producto específico
router.get('/producto/:productoId', async (req, res) => {
  try {
    const movimientos = await Movimiento.find({ producto: req.params.productoId })
      .populate('usuario', 'nombre')
      .sort({ createdAt: -1 });
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener movimientos', error: error.message });
  }
});

export default router;
