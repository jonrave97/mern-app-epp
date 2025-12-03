import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import Area from "../models/areaModel.js";
import LoginAttempt from "../models/loginAttemptModel.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { getUserbyEmailWithPassword } from "../services/userServices.js";

// Obtener todos los usuarios con paginación
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const rol = req.query.rol || '';
    const disabled = req.query.disabled || '';

    // Filtro de búsqueda
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    // Agregar filtro de rol si se proporciona
    if (rol) {
      searchFilter.rol = rol;
    }

    // Agregar filtro de estado disabled si se proporciona
    if (disabled === 'true') {
      searchFilter.disabled = true;
    } else if (disabled === 'false') {
      searchFilter.disabled = { $ne: true };
    }

    // Ejecutar consultas en paralelo para mejor rendimiento
    const [users, totalFiltered, totalGeneral, activeGeneral, inactiveGeneral] = await Promise.all([
      User.find(searchFilter)
        .select('-password -token')
        .lean()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }), // Agregar sort para consistencia
      User.countDocuments(searchFilter),
      User.countDocuments(),
      User.countDocuments({ disabled: { $ne: true } }),
      User.countDocuments({ disabled: true })
    ]);

    // Asegurar que disabled esté presente en cada usuario
    const usersWithDisabled = users.map(user => ({
      ...user,
      disabled: user.disabled === true
    }));

    const totalPages = Math.ceil(totalFiltered / limit);

    return res.status(200).json({
      success: true,
      users: usersWithDisabled,
      data: usersWithDisabled,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalFiltered,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats: {
        total: totalGeneral,
        active: activeGeneral,
        inactive: inactiveGeneral
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
    const { name, email, password, rol, company, area, approverIds } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Nombre, email y contraseña son obligatorios" 
      });
    }

    // Ejecutar validaciones en paralelo
    const validationPromises = [];
    
    // Validar empresa si se proporciona
    if (company) {
      validationPromises.push(
        Company.findOne({ name: company, disabled: { $ne: true } }).lean()
          .then(companyExists => {
            if (!companyExists) throw new Error("La empresa seleccionada no es válida o está inactiva");
          })
      );
    }

    // Validar área si se proporciona
    if (area) {
      validationPromises.push(
        Area.findOne({ name: area, disabled: { $ne: true } }).lean()
          .then(areaExists => {
            if (!areaExists) throw new Error("El área seleccionada no es válida o está inactiva");
          })
      );
    }

    // Validar que no exista el email
    validationPromises.push(
      User.findOne({ email }).lean()
        .then(existingUser => {
          if (existingUser) throw new Error("Ya existe un usuario con ese email");
        })
    );

    // Validar aprobadores si se proporcionan
    let bossesList = [];
    if (approverIds && approverIds.length > 0) {
      validationPromises.push(
        User.find({ _id: { $in: approverIds } }).select('_id').lean()
          .then(approvers => {
            if (approvers.length !== approverIds.length) {
              throw new Error("Uno o más jefes/aprobadores no existen");
            }
            bossesList = approverIds.map(id => ({ boss: id }));
          })
      );
    }

    // Ejecutar todas las validaciones en paralelo
    try {
      await Promise.all(validationPromises);
    } catch (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      rol: rol || 'usuario',
      company: company || undefined,
      area: area || undefined,
      bosses: bossesList
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
    const { name, email, password, rol, disabled, company, area, approverIds, bosses } = req.body;

    const user = await User.findById(id).lean();
    console.log('Usuario encontrado para actualización:', user);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Ejecutar validaciones en paralelo
    const validationPromises = [];

    // Validar empresa si se proporciona
    if (company) {
      validationPromises.push(
        Company.findOne({ name: company, disabled: { $ne: true } }).lean()
          .then(companyExists => {
            if (!companyExists) throw new Error("La empresa seleccionada no es válida o está inactiva");
          })
      );
    }

    // Validar área si se proporciona
    if (area) {
      validationPromises.push(
        Area.findOne({ name: area, disabled: { $ne: true } }).lean()
          .then(areaExists => {
            if (!areaExists) throw new Error("El área seleccionada no es válida o está inactiva");
          })
      );
    }

    // Validar email único si cambió
    if (email && email !== user.email) {
      validationPromises.push(
        User.findOne({ email }).lean()
          .then(existingUser => {
            if (existingUser) throw new Error("Ya existe un usuario con ese email");
          })
      );
    }

    // Validar aprobadores/jefes
    const bossesInput = bosses || approverIds;
    let bossesList = [];
    if (bossesInput !== undefined && bossesInput.length > 0) {
      validationPromises.push(
        User.find({ _id: { $in: bossesInput } }).select('_id').lean()
          .then(approvers => {
            if (approvers.length !== bossesInput.length) {
              throw new Error("Uno o más jefes/aprobadores no existen");
            }
            bossesList = bossesInput.map(id => ({ boss: id }));
          })
      );
    } else if (bossesInput !== undefined) {
      bossesList = [];
    }

    // Ejecutar todas las validaciones en paralelo
    try {
      await Promise.all(validationPromises);
    } catch (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    // Preparar objeto de actualización
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (rol) updateData.rol = rol;
    if (disabled !== undefined) updateData.disabled = disabled;
    if (company !== undefined) updateData.company = company || undefined;
    if (area !== undefined) updateData.area = area || undefined;
    if (bossesInput !== undefined) updateData.bosses = bossesList;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Usar findByIdAndUpdate para mejor rendimiento
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -token').lean();

    console.log("✅ Usuario actualizado:", updatedUser);
    return res.status(200).json({
      message: "Usuario actualizado exitosamente",
      data: updatedUser
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

export const registerUser = async (req, res) => {
  // Extraer datos del cuerpo de la solicitud
  const { name, email, password } = req.body;

  // res.send({
  //   message: "Datos recibidos para registro:",
  //   data: { name, email, password },
  // });
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
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "El email y la contraseña son obligatorios" });
    }

    // Verificar si puede intentar login
    const loginCheck = await LoginAttempt.canAttemptLogin(email);
    
    if (!loginCheck.allowed) {
      const minutes = Math.ceil(loginCheck.remainingTime / 60);
      const seconds = loginCheck.remainingTime % 60;
      const timeText = minutes > 0 
        ? `${minutes} minuto${minutes > 1 ? 's' : ''}` 
        : `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
      
      return res.status(429).json({ 
        message: `Cuenta temporalmente bloqueada. Demasiados intentos fallidos. Intenta nuevamente en ${timeText}.`,
        isBlocked: true,
        remainingTime: loginCheck.remainingTime,
        attempts: loginCheck.attempts
      });
    }

    //Buscar el usuario por email (CON contraseña para validar)
    const userFound = await getUserbyEmailWithPassword(email);
    if (!userFound) {
      // Incrementar intentos fallidos
      await LoginAttempt.incFailedAttempt(email);
      return res.status(401).json({ 
        message: "Email o contraseña incorrectos",
        attemptsRemaining: Math.max(0, 3 - (loginCheck.attempts || 0) - 1)
      });
    }

    // Verificar si el usuario está deshabilitado
    if (userFound.disabled) {
      return res.status(401).json({ 
        message: "Cuenta desactivada. Contacta al administrador." 
      });
    }

    // Verificar la contraseña y compara con la almacenada
    console.log("Contraseña almacenada:", userFound.password);
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      console.log("❌ Contraseña incorrecta para el usuario:", email);
      
      // Incrementar intentos fallidos
      const attempt = await LoginAttempt.incFailedAttempt(email);
      const attemptsRemaining = Math.max(0, 3 - attempt.attempts);
      
      let message = "Credenciales incorrectas";
      if (attemptsRemaining > 0) {
        message += `. Te quedan ${attemptsRemaining} intento${attemptsRemaining !== 1 ? 's' : ''}`;
      } else {
        message = "Demasiados intentos fallidos. Cuenta bloqueada por 1 minuto.";
      }
      
      return res.status(401).json({ 
        message,
        attemptsRemaining
      });
    }

    // Login exitoso - limpiar intentos fallidos
    await LoginAttempt.resetAttempts(email);

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
      message: "Login exitoso", 
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
