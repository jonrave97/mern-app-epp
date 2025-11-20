import { Router } from "express";
import {getAllWarehouses} from "../controllers/warehouseController.js";
import { get } from "mongoose";
const warehouseRoutes = Router();

warehouseRoutes.get('/all',getAllWarehouses); // Ruta para obtener todos los almacenes
export default warehouseRoutes;