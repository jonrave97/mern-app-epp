import warehosemodels from '../models/warehouseModel.js';

export const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await warehosemodels.find(); // Obtener todos los almacenes
    // console.log("✅ Almacenes obtenidos:", warehouses);
    return res.status(200).json(warehouses);
  } catch (error) {
    console.error("❌ Error al obtener almacenes:", error.message);
    return res.status(500).json({ message: "Error al obtener almacenes" });
  }
  // console.log("Get all warehouses controller reached");
  // return res.status(200).json({ message: "Get all warehouses controller reached" });
};