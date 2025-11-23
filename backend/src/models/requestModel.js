import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  // Identificación
  code: {
    type: Number,
    unique: [true, 'El código de entrega ya existe'],
    required: [true, 'El código de entrega es obligatorio']
  },
  
  // Información de la solicitud
  reason: {
    type: String,
    enum: ['Deterioro', 'Reposición', 'Nuevo Ingreso', 'Otro'],
    required: [true, 'La razón es obligatoria']
  },
  
  special: {
    type: Boolean,
    default: false
  },
  
  status: {
    type: String,
    enum: ['Pendiente', 'Aprobado', 'Entregado', 'Rechazado'],
    default: 'Pendiente'
  },
  
  stock: {
    type: String,
    enum: ['Con Stock', 'Sin Stock', 'Parcial'],
    default: 'Con Stock'
  },
  
  observation: {
    type: String,
    maxlength: [500, 'La observación no puede exceder 500 caracteres'],
    trim: true
  },
  
  // Referencias
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: [true, 'La bodega es obligatoria']
  },
  
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El empleado es obligatorio']
  },
  
  approver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  bosses: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // EPPs solicitados
  epps: [{
    epp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Epp',
      required: true
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad debe ser al menos 1'],
      max: [9999, 'La cantidad no puede exceder 9999']
    }
  }],
  
  // Tokens y fechas de aprobación
  approvalToken: {
    type: String,
    unique: true,
    sparse: true
  },
  
  approveDate: {
    type: Date
  },
  
  // Tokens y fechas de entrega
  deliveryToken: {
    type: String,
    unique: true,
    sparse: true
  },
  
  deliveryDate: {
    type: Date
  },
  
  // Fecha de solicitud
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Request = mongoose.model("Request", requestSchema);

export default Request;
