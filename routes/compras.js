import express from 'express';
import Compra from '../models/Compra.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarToken);

// Obtener todas las compras
router.get('/', async (req, res) => {
  try {
    const compras = await Compra.find().sort({ createdAt: -1 });
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener compras', error: error.message });
  }
});

// Crear compra
router.post('/', async (req, res) => {
  try {
    const compra = new Compra({ ...req.body, usuario: req.userId });
    await compra.save();
    res.status(201).json(compra);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear compra', error: error.message });
  }
});

// Actualizar compra
router.put('/:id', async (req, res) => {
  try {
    const compra = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!compra) return res.status(404).json({ message: 'Compra no encontrada' });
    res.json(compra);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar compra', error: error.message });
  }
});

// Eliminar compra
router.delete('/:id', async (req, res) => {
  try {
    const compra = await Compra.findByIdAndDelete(req.params.id);
    if (!compra) return res.status(404).json({ message: 'Compra no encontrada' });
    res.json({ message: 'Compra eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar compra', error: error.message });
  }
});

export default router;
