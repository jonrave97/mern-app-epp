import { Router } from "express";
import {
  getAllCompanies,
  createCompany,
  updateCompany
} from "../controllers/companyController.js";

const companyRoutes = Router();

companyRoutes.get('/all', getAllCompanies);
companyRoutes.post('/create', createCompany);
companyRoutes.put('/update/:id', updateCompany);

export default companyRoutes;
