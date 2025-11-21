import { Router } from "express";
import {
  getAllWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse
} from "../controllers/warehouseController.js";

const warehouseRoutes = Router();

warehouseRoutes.get('/all', getAllWarehouses);
warehouseRoutes.post('/create', createWarehouse);
warehouseRoutes.put('/update/:id', updateWarehouse);
warehouseRoutes.delete('/delete/:id', deleteWarehouse);

export default warehouseRoutes;