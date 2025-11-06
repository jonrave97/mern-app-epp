import mongoose from "mongoose"

/**
 * Interface que define la estructura de un usuario en la aplicación
 * @interface UserInterface
 * @description Define los campos requeridos para crear y manipular usuarios
 */
interface UserInterface {
    /** Nombre completo del usuario (2-50 caracteres) */
    name: string;
    /** Dirección de email única del usuario */
    email: string;
    /** Contraseña del usuario (8-100 caracteres, case-sensitive) */
    password: string;
}

const userSchema = new mongoose.Schema<UserInterface>({
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
    }
}, {
    timestamps: true
});

const User = mongoose.model<UserInterface>("User", userSchema);

export default User;