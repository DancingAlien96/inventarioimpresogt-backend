import express from 'express';
import Movimiento from '../models/Movimiento.js';
import Producto from '../models/Producto.js';
import { verificarToken } from '../middleware/auth.js';
import { sendTelegramNotification } from '../services/telegramService.js';

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

    await sendTelegramNotification(`✅ Se ha producido un cambio en Inventario ImpresoGT.\nRevisa la plataforma aquí:\nhttps://inventarioimpresogt-frontend.vercel.app/`);
    res.status(201).json(movimiento);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear movimiento', error: error.message });
  }
});

// Actualizar movimiento
router.put('/:id', async (req, res) => {
  try {
    const { tipo, producto: productoId, cantidad, nota } = req.body;
    const movimiento = await Movimiento.findById(req.params.id);

    if (!movimiento) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }

    const productoActual = await Producto.findById(movimiento.producto);
    if (!productoActual) {
      return res.status(404).json({ message: 'Producto original no encontrado' });
    }

    const mismoProducto = movimiento.producto.toString() === productoId;
    const productoNuevo = mismoProducto ? productoActual : await Producto.findById(productoId);

    if (!productoNuevo) {
      return res.status(404).json({ message: 'Producto nuevo no encontrado' });
    }

    if (mismoProducto) {
      const ajuste = (() => {
        if (movimiento.tipo === 'Entrada' && tipo === 'Entrada') return cantidad - movimiento.cantidad;
        if (movimiento.tipo === 'Entrada' && tipo === 'Salida') return -movimiento.cantidad - cantidad;
        if (movimiento.tipo === 'Salida' && tipo === 'Entrada') return movimiento.cantidad + cantidad;
        if (movimiento.tipo === 'Salida' && tipo === 'Salida') return -(cantidad - movimiento.cantidad);
        return 0;
      })();

      if (productoActual.cantidad + ajuste < 0) {
        return res.status(400).json({ message: 'No hay suficiente stock para actualizar el movimiento' });
      }
      productoActual.cantidad += ajuste;
      await productoActual.save();
    } else {
      if (movimiento.tipo === 'Entrada') {
        if (productoActual.cantidad < movimiento.cantidad) {
          return res.status(400).json({ message: 'No hay suficiente stock para revertir el movimiento original' });
        }
        productoActual.cantidad -= movimiento.cantidad;
      } else {
        productoActual.cantidad += movimiento.cantidad;
      }
      await productoActual.save();

      if (tipo === 'Salida' && productoNuevo.cantidad < cantidad) {
        return res.status(400).json({ message: 'No hay suficiente stock en el nuevo producto' });
      }

      if (tipo === 'Entrada') {
        productoNuevo.cantidad += cantidad;
      } else {
        productoNuevo.cantidad -= cantidad;
      }
      await productoNuevo.save();
    }

    movimiento.tipo = tipo;
    movimiento.producto = productoId;
    movimiento.cantidad = cantidad;
    movimiento.nota = nota || movimiento.nota;
    await movimiento.save();
    await movimiento.populate('producto', 'nombre');
    await movimiento.populate('usuario', 'nombre');

    await sendTelegramNotification(`✅ Se ha producido un cambio en Inventario ImpresoGT.\nRevisa la plataforma aquí:\nhttps://inventarioimpresogt-frontend.vercel.app/`);
    res.json(movimiento);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar movimiento', error: error.message });
  }
});

// Eliminar movimiento
router.delete('/:id', async (req, res) => {
  try {
    const movimiento = await Movimiento.findById(req.params.id);
    if (!movimiento) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }

    const producto = await Producto.findById(movimiento.producto);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (movimiento.tipo === 'Entrada') {
      if (producto.cantidad < movimiento.cantidad) {
        return res.status(400).json({ message: 'No hay suficiente stock para eliminar el movimiento' });
      }
      producto.cantidad -= movimiento.cantidad;
    } else {
      producto.cantidad += movimiento.cantidad;
    }

    await producto.save();
    await movimiento.deleteOne();

    await sendTelegramNotification(`✅ Se ha producido un cambio en Inventario ImpresoGT.\nRevisa la plataforma aquí:\nhttps://inventarioimpresogt-frontend.vercel.app/`);
    res.json({ message: 'Movimiento eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar movimiento', error: error.message });
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
