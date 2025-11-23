import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    costCenter: {
        type: String,
        required: true,
        trim: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

const Area = mongoose.model('Area', areaSchema);

export default Area;
