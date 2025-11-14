import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'El código del almacén es obligatorio'],
    trim: true,
    unique: true,
    minlength: [2, 'El código debe tener al menos 2 caracteres'],
    maxlength: [20, 'El código no puede exceder 20 caracteres']
  },
  name: {
    type: String,
    required: [true, 'El nombre del almacén es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  disabled: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;