import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  attempts: {
    type: Number,
    default: 1,
    max: 3
  },
  blockedUntil: {
    type: Date,
    default: null
  },
  lastAttempt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice para optimizar búsquedas por email
loginAttemptSchema.index({ email: 1 });

// Índice TTL para limpiar automáticamente registros expirados (después de 24 horas)
loginAttemptSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

// Método para verificar si el usuario está bloqueado
loginAttemptSchema.methods.isBlocked = function() {
  return this.blockedUntil && this.blockedUntil > Date.now();
};

// Método para obtener tiempo restante de bloqueo en segundos
loginAttemptSchema.methods.getRemainingBlockTime = function() {
  if (!this.blockedUntil) return 0;
  const remaining = Math.ceil((this.blockedUntil - Date.now()) / 1000);
  return Math.max(0, remaining);
};

// Método estático para incrementar intentos fallidos
loginAttemptSchema.statics.incFailedAttempt = async function(email) {
  const attempt = await this.findOne({ email });
  
  if (!attempt) {
    // Primer intento fallido
    return await this.create({
      email,
      attempts: 1,
      lastAttempt: new Date()
    });
  }
  
  // Incrementar intentos
  attempt.attempts += 1;
  attempt.lastAttempt = new Date();
  
  // Si alcanza 3 intentos, bloquear por 1 minuto
  if (attempt.attempts >= 3) {
    attempt.blockedUntil = new Date(Date.now() + 60 * 1000); // 1 minuto
  }
  
  return await attempt.save();
};

// Método estático para limpiar intentos tras login exitoso
loginAttemptSchema.statics.resetAttempts = async function(email) {
  await this.deleteOne({ email });
};

// Método estático para verificar si puede intentar login
loginAttemptSchema.statics.canAttemptLogin = async function(email) {
  const attempt = await this.findOne({ email });
  
  if (!attempt) {
    return { allowed: true };
  }
  
  // Si está bloqueado
  if (attempt.isBlocked()) {
    return { 
      allowed: false, 
      remainingTime: attempt.getRemainingBlockTime(),
      attempts: attempt.attempts 
    };
  }
  
  // Si no está bloqueado pero tiene intentos
  return { 
    allowed: true, 
    attempts: attempt.attempts 
  };
};

export default mongoose.model("LoginAttempt", loginAttemptSchema);