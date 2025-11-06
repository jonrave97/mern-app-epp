import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import {connectDB} from './database/db.js';

dotenv.config(); // Cargar variables de entorno
const app = express(); // Crear la aplicación de Express

// Definicion de URL de Frontend
const whiteList = [process.env.FRONTEND_URL];

// Impresion por consola de la URL del Frontend
console.log('🚀 Frontend URL:', whiteList);

// ========== MIDDLEWARES (DEBEN IR ANTES DE LAS RUTAS) ==========
app.use(morgan('dev')); // Middleware para registrar solicitudes HTTP
app.use(express.json()); // Habilitar el parseo de JSON en las solicitudes

// Configuración de CORS
app.use(cors({
    origin: function(origin, callback) {
        if (whiteList.includes(origin)) {
            // Puede consultar la API
            console.log('✅ Solicitud CORS permitida:', origin);
            
            callback(null, true);
        } else if (!origin) {
            // Puede consultar la API (Postman u otro cliente)
            console.log('✅ Solicitud CORS permitida (sin origen):', origin);
            callback(null, true);   
        } else {
            console.log('❌ Solicitud CORS denegada:', origin);
            // No puede consultar la API
            callback(new Error('Error de CORS: No permitido por CORS'));
        }
    },
    credentials: true
}));

// ========== RUTAS ==========
app.use('/api/users', userRoutes);

// ========== INICIAR SERVIDOR ==========
// Primero conectar a la base de datos, luego iniciar el servidor
console.log('🔄 Intentando conectar a la base de datos...');

connectDB()
    .then(() => {
        // Solo si la conexión es exitosa, iniciar el servidor
        app.listen(process.env.PORT || 5000, () => {
            console.log(`🚀 Servidor corriendo en el puerto: ${process.env.PORT || 5000}`);
        });
    })
    .catch(() => {
        // El error ya fue manejado en connectDB()
        // Solo necesitamos este catch para evitar unhandled promise rejection
    });