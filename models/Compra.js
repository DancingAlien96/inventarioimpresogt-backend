import mongoose from 'mongoose';

const compraSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  totalGastado: {
    type: Number,
    required: true,
    min: 0
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, { timestamps: true });

export default mongoose.model('Compra', compraSchema);
