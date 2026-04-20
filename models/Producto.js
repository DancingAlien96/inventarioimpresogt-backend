import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  cantidad: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  precioCompra: {
    type: Number,
    required: true,
    min: 0
  },
  precioVenta: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    enum: ['Papel', 'Tinta', 'Material Promocional', 'Servicios', 'Otros'],
    default: 'Otros'
  },
  stockMinimo: {
    type: Number,
    default: 5,
    min: 0
  }
}, {
  timestamps: true
});

// Método para verificar si está bajo stock
productoSchema.methods.bajStock = function() {
  return this.cantidad <= this.stockMinimo;
};

// Método para calcular margen de ganancia
productoSchema.methods.margenGanancia = function() {
  return this.precioVenta - this.precioCompra;
};

// Método para calcular porcentaje de ganancia
productoSchema.methods.porcentajeGanancia = function() {
  if (this.precioCompra === 0) return 0;
  return ((this.precioVenta - this.precioCompra) / this.precioCompra) * 100;
};

export default mongoose.model('Producto', productoSchema);
