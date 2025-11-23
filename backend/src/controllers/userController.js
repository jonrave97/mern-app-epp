import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { getUserbyEmailWithPassword } from "../services/userServices.js";

// Obtener todos los usuarios con paginación
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password -token')
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ disabled: { $ne: true } });
    const inactiveUsers = await User.countDocuments({ disabled: true });
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalUsers,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers
      }
    });
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error.message);
    return res.status(500).json({ success: false, message: "Error al obtener usuarios" });
  }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    const { name, email, password, rol, company } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Nombre, email y contraseña son obligatorios" 
      });
    }

    // Validar que la empresa exista si se proporciona
    if (company) {
      const companyExists = await Company.findOne({ name: company, disabled: { $ne: true } });
      if (!companyExists) {
        return res.status(400).json({ 
          message: "La empresa seleccionada no es válida o está inactiva" 
        });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "Ya existe un usuario con ese email" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      rol: rol || 'usuario',
      company: company || undefined
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.token;

    console.log("✅ Usuario creado:", userResponse);
    return res.status(201).json({
      message: "Usuario creado exitosamente",
      data: userResponse
    });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    return res.status(500).json({ message: "Error al crear usuario" });
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, rol, disabled, company } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar que la empresa exista si se proporciona
    if (company) {
      const companyExists = await Company.findOne({ name: company, disabled: { $ne: true } });
      if (!companyExists) {
        return res.status(400).json({ 
          message: "La empresa seleccionada no es válida o está inactiva" 
        });
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          message: "Ya existe un usuario con ese email" 
        });
      }
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (rol) user.rol = rol;
    if (disabled !== undefined) user.disabled = disabled;
    if (company !== undefined) user.company = company || undefined;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.token;

    console.log("✅ Usuario actualizado:", userResponse);
    return res.status(200).json({
      message: "Usuario actualizado exitosamente",
      data: userResponse
    });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    return res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("✅ Usuario eliminado:", user.email);
    return res.status(200).json({
      message: "Usuario eliminado exitosamente",
      data: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error.message);
    return res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

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
    console.log(userFound);
    return res.status(200).json({ 
      message: "Login exitoso1", 
      id: userFound._id, 
      name: userFound.name,
      email: userFound.email,
      rol: userFound.rol,
      createdAt: userFound.createdAt,
      token 
    });
    
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
        rol: user.rol,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error("❌ Error al obtener perfil:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
