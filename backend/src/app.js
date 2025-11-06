import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import {connectDB} from './database/db.js';

dotenv.config(); // Cargar variables de entorno
const app = express(); // Crear la aplicación de Express

// Conectar a la base de datos (sin capturar resultado)
connectDB();

app.use(morgan('dev')); // Middleware para registrar solicitudes HTTP

// Rutas
app.use('/api/users', userRoutes); // ✅ CORRECTO

// Definicion de URL de Frontend
const whiteList = [process.env.FRONTEND_URL];

// Impresion por consola de la URL del Frontend
console.log('🚀Frontend URL:', whiteList);

// Configuración de CORS
app.use(cors({
    origin: function(origin, callback) {
        if (whiteList.includes(origin)) {
            // Puede consultar la API
            console.log('✅Solicitud CORS permitida:', origin);
        
            // conectDB();
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


app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀Servidor corriendo en el puerto: ${process.env.PORT || 5000}`);
});