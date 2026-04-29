import express from 'express';
import Producto from '../models/Producto.js';
import { verificarToken } from '../middleware/auth.js';
import { sendTelegramNotification } from '../services/telegramService.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find().sort({ nombre: 1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
});

// Crear producto
router.post('/', async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    await sendTelegramNotification(`✅ Se ha producido un cambio en Inventario ImpresoGT.\nRevisa la plataforma aquí:\nhttps://inventarioimpresogt-frontend.vercel.app/`);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear producto', error: error.message });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await sendTelegramNotification(`✅ Se ha producido un cambio en Inventario ImpresoGT.\nRevisa la plataforma aquí:\nhttps://inventarioimpresogt-frontend.vercel.app/`);
    res.json(producto);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar producto', error: error.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await sendTelegramNotification(`✅ Se ha producido un cambio en Inventario ImpresoGT.\nRevisa la plataforma aquí:\nhttps://inventarioimpresogt-frontend.vercel.app/`);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
});

// Obtener productos con bajo stock
router.get('/alertas/bajo-stock', async (req, res) => {
  try {
    const productos = await Producto.find();
    const productosBajoStock = productos.filter(p => p.bajStock());
    res.json(productosBajoStock);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener alertas', error: error.message });
  }
});

export default router;
