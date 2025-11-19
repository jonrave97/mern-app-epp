import { Router } from "express";

const warehouseRoutes = Router();

warehouseRoutes.get('/', (req, res) => {
  res.json({ message: 'Rutas de almacenes (warehouses) funcionando' });
});

// Aquí irían las rutas relacionadas con los almacenes (warehouses)
export default warehouseRoutes;