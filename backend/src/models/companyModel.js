import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

const Company = mongoose.model('Company', companySchema);

export default Company;
