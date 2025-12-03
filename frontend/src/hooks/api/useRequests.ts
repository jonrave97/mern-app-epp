import { useState, useEffect, useCallback } from 'react';
import { 
  getMyRequests, 
  getTeamRequests,
  getMyTeam,
  createRequest as createRequestService,
  updateRequest as updateRequestService,
  deleteRequest as deleteRequestService,
  approveRequest as approveRequestService,
  rejectRequest as rejectRequestService
} from '@services/requestService';
import type { Request, CreateRequestDTO, UpdateRequestDTO, RequestFilters, TeamMember } from '../../types/request';

interface UseRequestsReturn {
  requests: Request[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  createRequest: (data: CreateRequestDTO) => Promise<void>;
  updateRequest: (id: string, data: UpdateRequestDTO) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  approveRequest: (id: string) => Promise<void>;
  rejectRequest: (id: string, observation?: string) => Promise<void>;
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
  setFilters: (filters: RequestFilters) => void;
}

interface UseTeamReturn {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
  setFilters: (filters: RequestFilters) => void;
}

/**
 * Hook para gestionar solicitudes del usuario actual
 */
export const useMyRequests = (): UseRequestsReturn => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestFilters>({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyRequests(filters);
      setRequests(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar solicitudes';
      setError(errorMessage);
      console.error('Error fetching my requests:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const createRequest = async (data: CreateRequestDTO) => {
    try {
      await createRequestService(data);
      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear solicitud';
      throw new Error(errorMessage);
    }
  };

  const updateRequest = async (id: string, data: UpdateRequestDTO) => {
    try {
      await updateRequestService(id, data);
      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar solicitud';
      throw new Error(errorMessage);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await deleteRequestService(id);
      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar solicitud';
      throw new Error(errorMessage);
    }
  };

  const approveRequest = async (id: string) => {
    try {
      await approveRequestService(id);
      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aprobar solicitud';
      throw new Error(errorMessage);
    }
  };

  const rejectRequest = async (id: string, observation?: string) => {
    try {
      await rejectRequestService(id, observation);
      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al rechazar solicitud';
      throw new Error(errorMessage);
    }
  };

  const setPage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return {
    requests,
    loading,
    error,
    pagination,
    createRequest,
    updateRequest,
    deleteRequest,
    approveRequest,
    rejectRequest,
    refresh: fetchRequests,
    setPage,
    setFilters,
  };
};

/**
 * Hook para gestionar solicitudes del equipo (para jefatura)
 */
export const useTeamRequests = (): UseRequestsReturn => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestFilters>({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTeamRequests(filters);
      setRequests(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar solicitudes del equipo';
      setError(errorMessage);
      console.error('Error fetching team requests:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const createRequest = async (data: CreateRequestDTO) => {
    try {
      await createRequestService(data);
      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear solicitud';
      throw new Error(errorMessage);
    }
  };

  const updateRequest = async (id: string, data: UpdateRequestDTO) => {
    try {
      await updateRequestService(id, data);
      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar solicitud';
      throw new Error(errorMessage);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await deleteRequestService(id);
      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar solicitud';
      throw new Error(errorMessage);
    }
  };

  const approveRequest = async (id: string) => {
    try {
      await approveRequestService(id);
      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aprobar solicitud';
      throw new Error(errorMessage);
    }
  };

  const rejectRequest = async (id: string, observation?: string) => {
    try {
      await rejectRequestService(id, observation);
      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al rechazar solicitud';
      throw new Error(errorMessage);
    }
  };

  const setPage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return {
    requests,
    loading,
    error,
    pagination,
    createRequest,
    updateRequest,
    deleteRequest,
    approveRequest,
    rejectRequest,
    refresh: fetchRequests,
    setPage,
    setFilters,
  };
};

/**
 * Hook para gestionar miembros del equipo
 */
export const useMyTeam = (): UseTeamReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestFilters>({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyTeam(filters);
      setTeamMembers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar miembros del equipo';
      setError(errorMessage);
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const setPage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return {
    teamMembers,
    loading,
    error,
    pagination,
    refresh: fetchTeamMembers,
    setPage,
    setFilters,
  };
};
