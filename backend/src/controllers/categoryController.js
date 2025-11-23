import Category from '../models/categoryModel.js';

// Obtener todas las categorías con paginación y búsqueda
export const getAllCategories = async (req, res) => {
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
                    { description: { $regex: search, $options: 'i' } }
                ]
              }
            : {};

        // Obtener categorías paginadas
        const categories = await Category.find(searchFilter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Contar totales con filtro de búsqueda (para paginación)
        const totalFiltered = await Category.countDocuments(searchFilter);
        
        // Estadísticas generales (sin filtro de búsqueda)
        const totalGeneral = await Category.countDocuments();
        const activeGeneral = await Category.countDocuments({ disabled: { $ne: true } });
        const inactiveGeneral = await Category.countDocuments({ disabled: true });

        res.json({
            categories,
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
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ message: 'Error al obtener categorías' });
    }
};

// Crear nueva categoría
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validaciones
        if (!name) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }

        // Verificar si ya existe una categoría con ese nombre
        const existingCategory = await Category.findOne({ name: name.toUpperCase() });
        if (existingCategory) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }

        const category = new Category({
            name: name.toUpperCase(),
            description: description || '',
            disabled: false
        });

        await category.save();
        res.status(201).json({
            message: 'Categoría creada exitosamente',
            category
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ message: 'Error al crear categoría' });
    }
};

// Actualizar categoría
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, disabled } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Verificar nombre único si se está cambiando
        if (name && name.toUpperCase() !== category.name) {
            const existingCategory = await Category.findOne({ name: name.toUpperCase() });
            if (existingCategory) {
                return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
            }
        }

        // Actualizar campos
        if (name !== undefined) category.name = name.toUpperCase();
        if (description !== undefined) category.description = description;
        if (disabled !== undefined) category.disabled = disabled;

        await category.save();
        res.json({
            message: 'Categoría actualizada exitosamente',
            category
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ message: 'Error al actualizar categoría' });
    }
};
