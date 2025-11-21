import warehosemodels from '../models/warehouseModel.js';

export const getAllWarehouses = async (req, res) => {
  try {
    // Obtener parámetros de paginación desde query params
    const page = parseInt(req.query.page) || 1; // Página actual (default: 1)
    const limit = parseInt(req.query.limit) || 10; // Elementos por página (default: 10)
    const skip = (page - 1) * limit; // Calcular cuántos documentos saltar

    // Obtener warehouses con paginación
    const warehouses = await warehosemodels.find()
      .skip(skip)
      .limit(limit);

    // Contar el total de documentos
    const totalWarehouses = await warehosemodels.countDocuments();
    
    // Contar bodegas activas e inactivas
    const activeWarehouses = await warehosemodels.countDocuments({ disabled: { $ne: true } });
    const inactiveWarehouses = await warehosemodels.countDocuments({ disabled: true });

    // Calcular total de páginas
    const totalPages = Math.ceil(totalWarehouses / limit);

    // Retornar respuesta con datos de paginación
    return res.status(200).json({
      data: warehouses,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalWarehouses,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats: {
        total: totalWarehouses,
        active: activeWarehouses,
        inactive: inactiveWarehouses
      }
    });
  } catch (error) {
    console.error("❌ Error al obtener almacenes:", error.message);
    return res.status(500).json({ message: "Error al obtener almacenes" });
  }
};

export const createWarehouse = async (req, res) => {
  try {
    const { code, name } = req.body;

    // Validar campos requeridos
    if (!code || !name) {
      return res.status(400).json({ 
        message: "Código y nombre son obligatorios" 
      });
    }

    // Verificar si ya existe el código
    const existingWarehouse = await warehosemodels.findOne({ code });
    if (existingWarehouse) {
      return res.status(400).json({ 
        message: "Ya existe una bodega con ese código" 
      });
    }

    // Crear nueva bodega
    const newWarehouse = new warehosemodels({
      code: code.trim(),
      name: name.trim(),
      disabled: false
    });

    await newWarehouse.save();

    console.log("✅ Bodega creada:", newWarehouse);
    return res.status(201).json({
      message: "Bodega creada exitosamente",
      data: newWarehouse
    });
  } catch (error) {
    console.error("❌ Error al crear bodega:", error.message);
    
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    return res.status(500).json({ message: "Error al crear bodega" });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, disabled } = req.body;

    // Verificar si la bodega existe
    const warehouse = await warehosemodels.findById(id);
    if (!warehouse) {
      return res.status(404).json({ message: "Bodega no encontrada" });
    }

    // Si se está cambiando el código, verificar que no exista
    if (code && code !== warehouse.code) {
      const existingWarehouse = await warehosemodels.findOne({ code });
      if (existingWarehouse) {
        return res.status(400).json({ 
          message: "Ya existe una bodega con ese código" 
        });
      }
    }

    // Actualizar campos
    if (code) warehouse.code = code.trim();
    if (name) warehouse.name = name.trim();
    if (disabled !== undefined) warehouse.disabled = disabled;

    await warehouse.save();

    console.log("✅ Bodega actualizada:", warehouse);
    return res.status(200).json({
      message: "Bodega actualizada exitosamente",
      data: warehouse
    });
  } catch (error) {
    console.error("❌ Error al actualizar bodega:", error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    return res.status(500).json({ message: "Error al actualizar bodega" });
  }
};

export const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await warehosemodels.findByIdAndDelete(id);
    
    if (!warehouse) {
      return res.status(404).json({ message: "Bodega no encontrada" });
    }

    console.log("✅ Bodega eliminada:", warehouse);
    return res.status(200).json({
      message: "Bodega eliminada exitosamente",
      data: warehouse
    });
  } catch (error) {
    console.error("❌ Error al eliminar bodega:", error.message);
    return res.status(500).json({ message: "Error al eliminar bodega" });
  }
};