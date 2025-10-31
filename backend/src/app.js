import express from 'express';
import cors from 'cors';
// import conectDB from './config/db.js';
import dotenv from 'dotenv';
// import userRoutes from './routes/userRoutes.js';

const app = express(); // Crear la aplicación de Express

dotenv.config(); // Cargar variables de entorno

// Definicion de URL de Frontend
const whiteList = [process.env.FRONTEND_URL];

// Impresion por consola de la URL del Frontend
console.log('🚀Frontend URL:', whiteList);

app.use(cors({
    origin: function(origin, callback) {
        if (whiteList.includes(origin)) {
            // Puede consultar la API
            console.log('✅Solicitud CORS permitida:', origin);
            callback(null, true);
        } else if (!origin) {
            // Puede consultar la API (Postman u otro cliente)
            console.log('✅Solicitud CORS permitida (sin origen):', origin);
            callback(null, true);   
        } else {
            console.log('❌Solicitud CORS denegada:', origin);
            // No puede consultar la API
            callback(new Error('Error de CORS: No permitido por CORS'));
        }
    },
    credentials: true
}));
app.use(express.json()); // Habilitar el parseo de JSON en las solicitudes