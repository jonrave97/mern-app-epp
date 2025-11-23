import Position from '../models/positionModel.js';

// Obtener todas las posiciones con paginación y estadísticas
export const getAllPositions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        // Crear filtro de búsqueda
        const searchFilter = search 
            ? { name: { $regex: search, $options: 'i' } }
            : {};

        // Obtener posiciones paginadas con populate de epps
        const positions = await Position.find(searchFilter)
            .populate('epps', 'name code')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Contar totales con filtro de búsqueda (para paginación)
        const totalFiltered = await Position.countDocuments(searchFilter);
        
        // Estadísticas generales (sin filtro de búsqueda)
        const totalGeneral = await Position.countDocuments();
        const activeGeneral = await Position.countDocuments({ disabled: { $ne: true } });
        const inactiveGeneral = await Position.countDocuments({ disabled: true });

        res.json({
            positions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalFiltered / limit),
                totalItems: totalFiltered,
                itemsPerPage: limit,
                hasNextPage: page < Math.ceil(totalFiltered / limit),
                hasPrevPage: page > 1
            },
            stats: {
                total: totalGeneral,
                active: activeGeneral,
                inactive: inactiveGeneral
            }
        });
    } catch (error) {
        console.error('Error al obtener posiciones:', error);
        res.status(500).json({ message: 'Error al obtener posiciones' });
    }
};

// Crear nueva posición
export const createPosition = async (req, res) => {
    try {
        const { name, epps } = req.body;

        // Validaciones
        if (!name) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }

        // Verificar si ya existe una posición con ese nombre
        const existingPosition = await Position.findOne({ name });
        if (existingPosition) {
            return res.status(400).json({ message: 'Ya existe una posición con ese nombre' });
        }

        const position = new Position({
            name,
            epps: epps || [],
            disabled: false
        });

        await position.save();
        
        // Populate epps antes de enviar respuesta
        await position.populate('epps', 'name code');
        
        res.status(201).json({
            message: 'Posición creada exitosamente',
            position
        });
    } catch (error) {
        console.error('Error al crear posición:', error);
        res.status(500).json({ message: 'Error al crear posición' });
    }
};

// Actualizar posición
export const updatePosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, epps, disabled } = req.body;

        const position = await Position.findById(id);
        if (!position) {
            return res.status(404).json({ message: 'Posición no encontrada' });
        }

        // Verificar nombre único si se está cambiando
        if (name && name !== position.name) {
            const existingPosition = await Position.findOne({ name });
            if (existingPosition) {
                return res.status(400).json({ message: 'Ya existe una posición con ese nombre' });
            }
        }

        // Actualizar campos
        if (name !== undefined) position.name = name;
        if (epps !== undefined) position.epps = epps;
        if (disabled !== undefined) position.disabled = disabled;

        await position.save();
        
        // Populate epps antes de enviar respuesta
        await position.populate('epps', 'name code');
        
        res.json({
            message: 'Posición actualizada exitosamente',
            position
        });
    } catch (error) {
        console.error('Error al actualizar posición:', error);
        res.status(500).json({ message: 'Error al actualizar posición' });
    }
};
