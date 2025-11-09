import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor (ver qué se envía)
// api.interceptors.request.use(
//   (config) => {
//     console.log('📤 Enviando petición:', {
//       method: config.method,
//       url: config.url,
//       baseURL: config.baseURL,
//       data: config.data
//     });
//     return config;
//   },
//   (error) => {
//     console.error('❌ Error en request:', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor (ver qué se recibe)
// api.interceptors.response.use(
//   (response) => {
//     console.log('📥 Respuesta recibida:', {
//       status: response.status,
//       data: response.data,
//       url: response.config.url
//     });
//     return response;
//   },
//   (error) => {
//     console.error('❌ Error en response:', {
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message
//     });
//     return Promise.reject(error);
//   }
// );
// registro de usuarios
// const registerUser = async (userData:{ email: string; password: string }) => {
//    const response = await api.post('/register', userData);
//         return response.data;
// };

export default api;
