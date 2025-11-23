import Area from '../models/areaModel.js';

// Obtener todas las áreas con paginación y estadísticas
export const getAllAreas = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Obtener áreas paginadas
        const areas = await Area.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Contar totales
        const total = await Area.countDocuments();
        const active = await Area.countDocuments({ disabled: { $ne: true } });
        const inactive = await Area.countDocuments({ disabled: true });

        res.json({
            areas,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            },
            stats: {
                total,
                active,
                inactive
            }
        });
    } catch (error) {
        console.error('Error al obtener áreas:', error);
        res.status(500).json({ message: 'Error al obtener áreas' });
    }
};

// Crear nueva área
export const createArea = async (req, res) => {
    try {
        const { name, costCenter } = req.body;

        // Validaciones
        if (!name || !costCenter) {
            return res.status(400).json({ message: 'El nombre y centro de costo son requeridos' });
        }

        // Verificar si ya existe un área con ese nombre
        const existingArea = await Area.findOne({ name });
        if (existingArea) {
            return res.status(400).json({ message: 'Ya existe un área con ese nombre' });
        }

        // Verificar si ya existe un área con ese centro de costo
        const existingCostCenter = await Area.findOne({ costCenter: costCenter.toUpperCase() });
        if (existingCostCenter) {
            return res.status(400).json({ message: 'Ya existe un área con ese centro de costo' });
        }

        const area = new Area({
            name,
            costCenter: costCenter.toUpperCase(),
            disabled: false
        });

        await area.save();
        res.status(201).json({
            message: 'Área creada exitosamente',
            area
        });
    } catch (error) {
        console.error('Error al crear área:', error);
        res.status(500).json({ message: 'Error al crear área' });
    }
};

// Actualizar área
export const updateArea = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, costCenter, disabled } = req.body;

        const area = await Area.findById(id);
        if (!area) {
            return res.status(404).json({ message: 'Área no encontrada' });
        }

        // Verificar nombre único si se está cambiando
        if (name && name !== area.name) {
            const existingArea = await Area.findOne({ name });
            if (existingArea) {
                return res.status(400).json({ message: 'Ya existe un área con ese nombre' });
            }
        }

        // Verificar costCenter único si se está cambiando
        if (costCenter && costCenter.toUpperCase() !== area.costCenter) {
            const existingCostCenter = await Area.findOne({ costCenter: costCenter.toUpperCase() });
            if (existingCostCenter) {
                return res.status(400).json({ message: 'Ya existe un área con ese centro de costo' });
            }
        }

        // Actualizar campos
        if (name !== undefined) area.name = name;
        if (costCenter !== undefined) area.costCenter = costCenter.toUpperCase();
        if (disabled !== undefined) area.disabled = disabled;

        await area.save();
        res.json({
            message: 'Área actualizada exitosamente',
            area
        });
    } catch (error) {
        console.error('Error al actualizar área:', error);
        res.status(500).json({ message: 'Error al actualizar área' });
    }
};
