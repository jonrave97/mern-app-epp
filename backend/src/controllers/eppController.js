import Epp from '../models/eppModel.js';

// Obtener todos los EPPs con paginación y búsqueda
export const getAllEpps = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        // Crear filtro de búsqueda
        const searchFilter = search 
            ? { 
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { code: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ]
              }
            : {};

        // Obtener EPPs paginados
        const epps = await Epp.find(searchFilter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Contar totales con filtro de búsqueda (para paginación)
        const totalFiltered = await Epp.countDocuments(searchFilter);
        
        // Estadísticas generales (sin filtro de búsqueda)
        const totalGeneral = await Epp.countDocuments();
        const activeGeneral = await Epp.countDocuments({ disabled: { $ne: true } });
        const inactiveGeneral = await Epp.countDocuments({ disabled: true });

        res.json({
            epps,
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
        console.error('Error al obtener EPPs:', error);
        res.status(500).json({ message: 'Error al obtener EPPs' });
    }
};

// Crear nuevo EPP
export const createEpp = async (req, res) => {
    try {
        const { code, name, price, category } = req.body;

        // Validaciones
        if (!code || !name || !price || !category) {
            return res.status(400).json({ message: 'Código, nombre, precio y categoría son requeridos' });
        }

        // Verificar si ya existe un EPP con ese código
        const existingEpp = await Epp.findOne({ code });
        if (existingEpp) {
            return res.status(400).json({ message: 'Ya existe un EPP con ese código' });
        }

        const epp = new Epp({
            code,
            name,
            price,
            category: category.toUpperCase(),
            disabled: false
        });

        await epp.save();
        res.status(201).json({
            message: 'EPP creado exitosamente',
            epp
        });
    } catch (error) {
        console.error('Error al crear EPP:', error);
        res.status(500).json({ message: 'Error al crear EPP' });
    }
};

// Actualizar EPP
export const updateEpp = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, name, price, category, disabled } = req.body;

        const epp = await Epp.findById(id);
        if (!epp) {
            return res.status(404).json({ message: 'EPP no encontrado' });
        }

        // Verificar código único si se está cambiando
        if (code && code !== epp.code) {
            const existingEpp = await Epp.findOne({ code });
            if (existingEpp) {
                return res.status(400).json({ message: 'Ya existe un EPP con ese código' });
            }
        }

        // Actualizar campos
        if (code !== undefined) epp.code = code;
        if (name !== undefined) epp.name = name;
        if (price !== undefined) epp.price = price;
        if (category !== undefined) epp.category = category.toUpperCase();
        if (disabled !== undefined) epp.disabled = disabled;

        await epp.save();
        res.json({
            message: 'EPP actualizado exitosamente',
            epp
        });
    } catch (error) {
        console.error('Error al actualizar EPP:', error);
        res.status(500).json({ message: 'Error al actualizar EPP' });
    }
};

