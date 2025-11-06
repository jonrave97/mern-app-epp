import User from '../models/userModel.js';

export const registerUser = async (req, res ) =>
{
    // Extraer datos del cuerpo de la solicitud
    const { name, email, password } = req.body;

    // Crear un nuevo usuario
    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error.message);
        return res.status(500).send('Error al registrar usuario');
    }

    console.log(newUser);
    // console.log('Registro de usuario:', { name, email, password });
    res.send('Usuario registrado');
}

export const loginUser = (req, res ) =>res.send('Usuario logueado');
