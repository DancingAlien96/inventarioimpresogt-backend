import mongoose from 'mongoose';

const trabajoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true,
    default: ''
  },
  cliente: {
    type: String,
    trim: true,
    default: ''
  },
  // Materiales usados
  materiales: [{
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto'
    },
    nombreProducto: String,
    cantidad: Number,
    costoUnitario: Number,
    costoTotal: Number
  }],
  // Costos adicionales (mano de obra, servicios, etc)
  costosAdicionales: {
    type: Number,
    default: 0
  },
  notaCostos: {
    type: String,
    default: ''
  },
  // Total del trabajo
  costoProduccion: {
    type: Number,
    required: true
  },
  precioVenta: {
    type: Number,
    required: true
  },
  // Estado
  estado: {
    type: String,
    enum: ['Cotizado', 'En Proceso', 'Completado', 'Entregado'],
    default: 'Cotizado'
  },
  fechaEntrega: {
    type: Date
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, {
  timestamps: true
});

// Método para calcular ganancia
trabajoSchema.methods.ganancia = function() {
  return this.precioVenta - this.costoProduccion;
};

// Método para calcular porcentaje de ganancia
trabajoSchema.methods.porcentajeGanancia = function() {
  if (this.costoProduccion === 0) return 0;
  return ((this.precioVenta - this.costoProduccion) / this.costoProduccion) * 100;
};

export default mongoose.model('Trabajo', trabajoSchema);
