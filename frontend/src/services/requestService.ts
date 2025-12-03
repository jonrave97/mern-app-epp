import api from './api';
import type { 
  Request, 
  CreateRequestDTO, 
  UpdateRequestDTO, 
  RequestFilters,
  RequestsResponse,
  TeamMembersResponse
} from '../types/request';

/**
 * Servicio para gestionar solicitudes de EPP
 */

/**
 * Obtener solicitudes del usuario actual
 */
export const getMyRequests = async (filters: RequestFilters = {}): Promise<RequestsResponse> => {
  const { data } = await api.get<RequestsResponse>('/requests/my-requests', { params: filters });
  return data;
};

/**
 * Obtener solicitudes del equipo (para jefatura)
 */
export const getTeamRequests = async (filters: RequestFilters = {}): Promise<RequestsResponse> => {
  const { data } = await api.get<RequestsResponse>('/requests/team-requests', { params: filters });
  return data;
};

/**
 * Obtener miembros del equipo
 */
export const getMyTeam = async (filters: RequestFilters = {}): Promise<TeamMembersResponse> => {
  const { data } = await api.get<TeamMembersResponse>('/requests/my-team', { params: filters });
  return data;
};

/**
 * Crear una nueva solicitud
 */
export const createRequest = async (requestData: CreateRequestDTO): Promise<{ success: boolean; message: string; data: Request }> => {
  const { data } = await api.post<{ success: boolean; message: string; data: Request }>('/requests', requestData);
  return data;
};

/**
 * Actualizar una solicitud
 */
export const updateRequest = async (id: string, requestData: UpdateRequestDTO): Promise<{ success: boolean; message: string; data: Request }> => {
  const { data } = await api.put<{ success: boolean; message: string; data: Request }>(`/requests/${id}`, requestData);
  return data;
};

/**
 * Eliminar una solicitud
 */
export const deleteRequest = async (id: string): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(`/requests/${id}`);
  return data;
};

/**
 * Aprobar una solicitud
 */
export const approveRequest = async (id: string): Promise<{ success: boolean; message: string; data: Request }> => {
  const { data } = await api.patch<{ success: boolean; message: string; data: Request }>(`/requests/${id}/approve`);
  return data;
};

/**
 * Rechazar una solicitud
 */
export const rejectRequest = async (id: string, observation?: string): Promise<{ success: boolean; message: string; data: Request }> => {
  const { data } = await api.patch<{ success: boolean; message: string; data: Request }>(`/requests/${id}/reject`, { observation });
  return data;
};
