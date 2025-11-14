import mongoose, { mongo } from "mongoose";
import { generateToken } from "../libs/tokenGenerator.js";

/**
 * Schema que define la estructura de un usuario en la aplicación
 * @description Define los campos requeridos para crear y manipular usuarios
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,       
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Formato de email inválido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        trim: true,
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        maxlength: [100, 'La contraseña no puede exceder 100 caracteres']
    },
    token:{
        type: String,
        trim: true,
        default: () => generateToken()
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position'
    },
    bosses:[
        {
            boss:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
            },
        },
    ],
    warehouses:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse'
    }
}, {
    timestamps: true // Agrega campos createdAt y updatedAt automáticamente
});

const User = mongoose.model("User", userSchema);

export default User;
