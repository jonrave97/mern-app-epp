import mongoose from "mongoose";

const eppSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: [true, 'El código del EPP ya existe'],
    required: [true, 'El código del EPP es obligatorio'],
    trim: true,
    minlength: [2, 'El código debe tener al menos 2 caracteres'],
    maxlength: [20, 'El código no puede exceder 20 caracteres']
  },
  name: {
    type: String,
    required: [true, 'El nombre del EPP es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio del EPP es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
    max: [999999.99, 'El precio no puede exceder 999999.99'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La categoría del EPP es obligatoria'],
    trim: true,
    uppercase: true,
    maxlength: [50, 'La categoría no puede exceder 50 caracteres']
  },
  disabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Epp = mongoose.model("Epp", eppSchema);

export default Epp;
