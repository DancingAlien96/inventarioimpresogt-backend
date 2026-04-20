import mongoose from 'mongoose';

const movimientoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['Entrada', 'Salida'],
    required: true
  },
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  nota: {
    type: String,
    trim: true,
    default: ''
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, {
  timestamps: true
});

export default mongoose.model('Movimiento', movimientoSchema);
