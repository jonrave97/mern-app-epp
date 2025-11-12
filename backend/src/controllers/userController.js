import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { getAllUsers } from '../services/userServices.js';

export const registerUser = async  (req, res ) =>
{
    // Extraer datos del cuerpo de la solicitud
    const { name, email, password } = req.body;

    res.send({ message: 'Datos recibidos para registro:', data: { name, email, password } });
    // Crear un nuevo usuario
    try {
        const newUser = new User({ name, email, password });

        //creamos una constante para hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        //imprimir la contraseña hasheada
        console.log('Contraseña hasheada:', newUser.password);

        //agrego la contraseña hasheada al nuevo usuario
        newUser.password = await bcrypt.hash(password, salt);
        // Guardar el usuario en la base de datos
        // await newUser.save();
        // Enviar una respuesta exitosa
        console.log('✅ Usuario registrado correctamente');
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error.message);
        return res.status(500).send('Error al registrar usuario');
    }

    // console.log(newUser);
    console.log('Registro de usuario:', { name, email, password });
    // res.send('Usuario registrado');
}

export const loginUser = (req, res ) =>
{
     const {  email, password } = req.body;
     console.log('✅ Usuario registrado encontrado');
}

export const getUsers = async (req, res) => {
    console.log('🔄 Solicitud para obtener todos los usuarios recibida');
  const result = await getAllUsers();
  
  if (result.success) {
    console.log('✅ Usuarios obtenidos correctamente');
    res.status(200).json(result);

  } else {
    console.log('❌ Error al obtener usuarios:', result.message);
    res.status(500).json(result);
  }
};
