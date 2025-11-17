import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { getUserbyEmailWithPassword } from "../services/userServices.js";
// import { generateToken } from "../libs/tokenGenerator.js";

export const registerUser = async (req, res) => {
  // Extraer datos del cuerpo de la solicitud
  const { name, email, password } = req.body;

  res.send({
    message: "Datos recibidos para registro:",
    data: { name, email, password },
  });
  // Crear un nuevo usuario
  try {
    const newUser = new User({ name, email, password });

    //creamos una constante para hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    //imprimir la contraseña hasheada
    console.log("Contraseña hasheada:", newUser.password);

    //agrego la contraseña hasheada al nuevo usuario
    newUser.password = await bcrypt.hash(password, salt);
    // Guardar el usuario en la base de datos
    // await newUser.save();
    // Enviar una respuesta exitosa
    console.log("✅ Usuario registrado correctamente");
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error.message);
    return res.status(500).send("Error al registrar usuario");
  }

  // console.log(newUser);
  console.log("Registro de usuario:", { name, email, password });
  // res.send('Usuario registrado');
};

export const loginUser = async (req, res) => {
  console.log("📨 req.body recibido:", req.body);
  console.log("📨 Tipo de req.body:", typeof req.body);

  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "El email y la contraseña son obligatorios" });
    }

    //Buscar el usuario por email (CON contraseña para validar)
    const userFound = await getUserbyEmailWithPassword(email);
    if (!userFound) {
      return res.status(401).json({ message: "Email o contraseña incorrectos" });
    }

    // Verificar la contraseña y compara con la almacenada
    console.log("Contraseña almacenada:", userFound.password);
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      console.log("❌ Contraseña incorrecta para el usuario:", email);
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jsonwebtoken.sign(
      { id: userFound._id,
        email: userFound.email
       },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    console.log("✅ Login exitoso para:", email);
    return res.status(200).json({ message: "Login exitoso", id: userFound._id, email: userFound.email, token });
    
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.message);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// Obtener perfil del usuario autenticado
export const getUserProfile = async (req, res) => {
  try {
    // Obtener el token del header
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    // Verificar y decodificar el token
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("✅ Perfil obtenido para:", user.email);
    return res.status(200).json({ 
      message: "Perfil obtenido exitosamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error("❌ Error al obtener perfil:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
