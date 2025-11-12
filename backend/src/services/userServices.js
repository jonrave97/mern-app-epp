import User from '../models/userModel.js';

// Obtener todos los usuarios
export const getAllUsers = async () => {
  try {
    console.log('🔍 Iniciando búsqueda de usuarios...');
    const users = await User.find().select('-password'); // Excluir contraseña
    console.log('✅ Usuarios encontrados:', users);
    console.log('📊 Total de usuarios:', users.length);
    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error('❌ Error en getAllUsers:', error);
    return {
      success: false,
      message: 'Error al obtener usuarios: ' + error.message,
    };
  }
};
