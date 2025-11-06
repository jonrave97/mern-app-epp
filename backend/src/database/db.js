import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI); 
        console.log('✅ Conectado a la base de datos correctamente');
    }catch(error){
        console.error('❌ Error al conectar a la base de datos:', error);
        throw error;
    }
}