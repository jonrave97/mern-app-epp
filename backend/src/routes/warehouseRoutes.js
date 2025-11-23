import { Router } from "express";
import {
  getAllWarehouses,
  createWarehouse,
  updateWarehouse
} from "../controllers/warehouseController.js";

const warehouseRoutes = Router();

warehouseRoutes.get('/all', getAllWarehouses);
warehouseRoutes.post('/create', createWarehouse);
warehouseRoutes.put('/update/:id', updateWarehouse);

export default warehouseRoutes;