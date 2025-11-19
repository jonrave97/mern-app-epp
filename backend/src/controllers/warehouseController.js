import warehosemodels from '../models/warehouseModels.js';

export const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await warehosemodels.find(); // Obtener todos los almacenes
    return res.status(200).json(warehouses);
  } catch (error) {
    console.error("❌ Error al obtener almacenes:", error.message);
    return res.status(500).json({ message: "Error al obtener almacenes" });
  }
};