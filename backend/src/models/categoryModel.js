import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: true,
        trim: true,
        uppercase: true,
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'La descripción no puede exceder 200 caracteres']
    },
    disabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
