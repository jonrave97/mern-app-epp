import Request from '../models/requestModel.js';
import User from '../models/userModel.js';

/**
 * Obtener solicitudes del usuario actual
 * GET /api/requests/my-requests
 */
export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id; // Desde middleware de autenticación
    const { page = 1, limit = 10, status, reason } = req.query;
    
    const query = { employee: userId };
    
    // Filtros opcionales
    if (status) query.status = status;
    if (reason) query.reason = reason;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [requests, total] = await Promise.all([
      Request.find(query)
        .populate('warehouse', 'name code')
        .populate('employee', 'name email')
        .populate('approver', 'name email')
        .populate('epps.epp', 'name code category')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      Request.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener mis solicitudes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las solicitudes',
      error: error.message 
    });
  }
};

/**
 * Obtener solicitudes del equipo (para jefatura)
 * GET /api/requests/team-requests
 * Muestra solicitudes de empleados que tienen como aprobador al usuario actual
 */
export const getTeamRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, reason, employeeId } = req.query;
    
    const query = { approver: userId };
    
    // Filtros opcionales
    if (status) query.status = status;
    if (reason) query.reason = reason;
    if (employeeId) query.employee = employeeId;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [requests, total] = await Promise.all([
      Request.find(query)
        .populate('warehouse', 'name code')
        .populate('employee', 'name email rol company area')
        .populate('approver', 'name email')
        .populate('epps.epp', 'name code category')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      Request.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener solicitudes del equipo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las solicitudes del equipo',
      error: error.message 
    });
  }
};

/**
 * Obtener miembros del equipo (usuarios que tienen como aprobador al usuario actual)
 * GET /api/requests/my-team
 */
export const getMyTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search, company, area } = req.query;
    
    // Query para buscar usuarios que tengan al usuario actual en su campo bosses
    // Nota: En la BD el campo puede ser bosses._id o bosses.boss según el formato
    const query = { 
      $or: [
        { 'bosses._id': userId },
        { 'bosses.boss': userId }
      ],
      disabled: false 
    };
    
    // Filtros opcionales
    if (search) {
      query.$and = [
        { 
          $or: [
            { 'bosses._id': userId },
            { 'bosses.boss': userId }
          ]
        },
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      ];
      delete query.$or;
    }
    if (company) query.company = company;
    if (area) query.area = area;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [teamMembers, total] = await Promise.all([
      User.find(query)
        .select('name email rol company area position disabled rut sizes costCenter')
        .populate('position', 'name')
        .sort({ name: 1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      User.countDocuments(query)
    ]);
    
    console.log(`🔍 Buscando equipo para usuario: ${userId}`);
    console.log(`📊 Total encontrados: ${total}`);
    
    res.status(200).json({
      success: true,
      data: teamMembers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener miembros del equipo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los miembros del equipo',
      error: error.message 
    });
  }
};

/**
 * Crear una nueva solicitud
 * POST /api/requests
 */
export const createRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener el usuario para obtener su aprobador
    const user = await User.findById(userId).select('approvers').lean();
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    // Generar código único (último + 1)
    const lastRequest = await Request.findOne().sort({ code: -1 }).limit(1).lean();
    const newCode = lastRequest ? lastRequest.code + 1 : 1;
    
    const requestData = {
      ...req.body,
      code: newCode,
      employee: userId,
      approver: user.approvers && user.approvers.length > 0 ? user.approvers[0] : null
    };
    
    const newRequest = await Request.create(requestData);
    
    // Poblar para retornar datos completos
    const populatedRequest = await Request.findById(newRequest._id)
      .populate('warehouse', 'name code')
      .populate('employee', 'name email')
      .populate('approver', 'name email')
      .populate('epps.epp', 'name code category')
      .lean();
    
    res.status(201).json({
      success: true,
      message: 'Solicitud creada exitosamente',
      data: populatedRequest
    });
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear la solicitud',
      error: error.message 
    });
  }
};

/**
 * Actualizar una solicitud
 * PUT /api/requests/:id
 */
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Verificar que la solicitud existe y pertenece al usuario
    const request = await Request.findById(id);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Solicitud no encontrada' 
      });
    }
    
    // Solo el empleado dueño puede editar si está en estado Pendiente
    if (request.employee.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para editar esta solicitud' 
      });
    }
    
    if (request.status !== 'Pendiente') {
      return res.status(400).json({ 
        success: false, 
        message: 'Solo se pueden editar solicitudes en estado Pendiente' 
      });
    }
    
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('warehouse', 'name code')
      .populate('employee', 'name email')
      .populate('approver', 'name email')
      .populate('epps.epp', 'name code category')
      .lean();
    
    res.status(200).json({
      success: true,
      message: 'Solicitud actualizada exitosamente',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar la solicitud',
      error: error.message 
    });
  }
};

/**
 * Eliminar una solicitud
 * DELETE /api/requests/:id
 */
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const request = await Request.findById(id);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Solicitud no encontrada' 
      });
    }
    
    // Solo el empleado dueño puede eliminar si está en estado Pendiente
    if (request.employee.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para eliminar esta solicitud' 
      });
    }
    
    if (request.status !== 'Pendiente') {
      return res.status(400).json({ 
        success: false, 
        message: 'Solo se pueden eliminar solicitudes en estado Pendiente' 
      });
    }
    
    await Request.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Solicitud eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar la solicitud',
      error: error.message 
    });
  }
};

/**
 * Aprobar una solicitud (para jefatura)
 * PATCH /api/requests/:id/approve
 */
export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const request = await Request.findById(id);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Solicitud no encontrada' 
      });
    }
    
    // Verificar que el usuario es el aprobador
    if (request.approver.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para aprobar esta solicitud' 
      });
    }
    
    if (request.status !== 'Pendiente') {
      return res.status(400).json({ 
        success: false, 
        message: 'Solo se pueden aprobar solicitudes en estado Pendiente' 
      });
    }
    
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { 
        status: 'Aprobado',
        approveDate: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('warehouse', 'name code')
      .populate('employee', 'name email')
      .populate('approver', 'name email')
      .populate('epps.epp', 'name code category')
      .lean();
    
    res.status(200).json({
      success: true,
      message: 'Solicitud aprobada exitosamente',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error al aprobar solicitud:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al aprobar la solicitud',
      error: error.message 
    });
  }
};

/**
 * Rechazar una solicitud (para jefatura)
 * PATCH /api/requests/:id/reject
 */
export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { observation } = req.body;
    
    const request = await Request.findById(id);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Solicitud no encontrada' 
      });
    }
    
    // Verificar que el usuario es el aprobador
    if (request.approver.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para rechazar esta solicitud' 
      });
    }
    
    if (request.status !== 'Pendiente') {
      return res.status(400).json({ 
        success: false, 
        message: 'Solo se pueden rechazar solicitudes en estado Pendiente' 
      });
    }
    
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { 
        status: 'Rechazado',
        observation: observation || request.observation
      },
      { new: true, runValidators: true }
    )
      .populate('warehouse', 'name code')
      .populate('employee', 'name email')
      .populate('approver', 'name email')
      .populate('epps.epp', 'name code category')
      .lean();
    
    res.status(200).json({
      success: true,
      message: 'Solicitud rechazada',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al rechazar la solicitud',
      error: error.message 
    });
  }
};
