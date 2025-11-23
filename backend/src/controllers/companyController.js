import Company from '../models/companyModel.js';

export const getAllCompanies = async (req, res) => {
  try {
    // Obtener parámetros de paginación desde query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Obtener companies con paginación
    const companies = await Company.find()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 }); // Ordenar por nombre

    // Contar el total de documentos
    const totalCompanies = await Company.countDocuments();
    
    // Contar empresas activas e inactivas
    const activeCompanies = await Company.countDocuments({ disabled: { $ne: true } });
    const inactiveCompanies = await Company.countDocuments({ disabled: true });

    // Calcular total de páginas
    const totalPages = Math.ceil(totalCompanies / limit);

    // Retornar respuesta con datos de paginación
    return res.status(200).json({
      data: companies,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCompanies,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats: {
        total: totalCompanies,
        active: activeCompanies,
        inactive: inactiveCompanies
      }
    });
  } catch (error) {
    console.error("❌ Error al obtener empresas:", error.message);
    return res.status(500).json({ message: "Error al obtener empresas" });
  }
};

export const createCompany = async (req, res) => {
  try {
    const { name } = req.body;

    // Validar campos requeridos
    if (!name) {
      return res.status(400).json({ 
        message: "El nombre de la empresa es obligatorio" 
      });
    }

    // Verificar si ya existe el nombre
    const existingCompany = await Company.findOne({ name: name.trim() });
    if (existingCompany) {
      return res.status(400).json({ 
        message: "Ya existe una empresa con ese nombre" 
      });
    }

    // Crear nueva empresa
    const newCompany = new Company({
      name: name.trim(),
      disabled: false
    });

    await newCompany.save();

    console.log("✅ Empresa creada:", newCompany);
    return res.status(201).json({
      message: "Empresa creada exitosamente",
      data: newCompany
    });
  } catch (error) {
    console.error("❌ Error al crear empresa:", error.message);
    
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    // Error de duplicado (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Ya existe una empresa con ese nombre" 
      });
    }

    return res.status(500).json({ message: "Error al crear empresa" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, disabled } = req.body;

    // Verificar si la empresa existe
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    // Si se intenta cambiar el nombre, verificar que no exista otra empresa con ese nombre
    if (name && name.trim() !== company.name) {
      const existingName = await Company.findOne({ 
        name: name.trim(),
        _id: { $ne: id } // Excluir la empresa actual
      });
      if (existingName) {
        return res.status(400).json({ 
          message: "Ya existe otra empresa con ese nombre" 
        });
      }
    }

    // Preparar datos para actualizar
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (disabled !== undefined) updateData.disabled = disabled;

    // Actualizar la empresa
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log("✅ Empresa actualizada:", updatedCompany);
    return res.status(200).json({
      message: "Empresa actualizada exitosamente",
      data: updatedCompany
    });
  } catch (error) {
    console.error("❌ Error al actualizar empresa:", error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Ya existe una empresa con ese nombre" 
      });
    }

    return res.status(500).json({ message: "Error al actualizar empresa" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la empresa existe
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    // Soft delete - cambiar estado a disabled
    company.disabled = !company.disabled;
    await company.save();

    console.log(`✅ Empresa ${company.disabled ? 'desactivada' : 'activada'}:`, company);
    return res.status(200).json({
      message: `Empresa ${company.disabled ? 'desactivada' : 'activada'} exitosamente`,
      data: company
    });
  } catch (error) {
    console.error("❌ Error al cambiar estado de empresa:", error.message);
    return res.status(500).json({ message: "Error al cambiar estado de empresa" });
  }
};
