import jsonwebtoken from 'jsonwebtoken';

/**
 * Middleware para verificar token JWT
 * Agrega req.user con { id, email, rol }
 */
export const verifyToken = (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Token no proporcionado. Acceso denegado." 
      });
    }

    // Verificar y decodificar el token
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    
    // Agregar información del usuario al request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };
    
    next();
  } catch (error) {
    console.error("❌ Error al verificar token:", error.message);
    return res.status(401).json({ 
      success: false,
      message: "Token inválido o expirado" 
    });
  }
};

/**
 * Middleware para verificar roles específicos
 * @param {string[]} allowedRoles - Array de roles permitidos
 */
export const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Usuario no autenticado" 
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ 
        success: false,
        message: "No tienes permisos para acceder a este recurso" 
      });
    }

    next();
  };
};
