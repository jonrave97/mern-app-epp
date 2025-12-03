export interface Epp {
  _id: string;
  name: string;
  code: string;
  category: {
    _id: string;
    name: string;
  };
}

export interface RequestEpp {
  epp: Epp | string;
  quantity: number;
  _id?: string;
}

export interface Request {
  _id: string;
  code: number;
  reason: 'Deterioro' | 'Reposición' | 'Nuevo Ingreso' | 'Otro';
  special: boolean;
  status: 'Pendiente' | 'Aprobado' | 'Entregado' | 'Rechazado';
  stock: 'Con Stock' | 'Sin Stock' | 'Parcial';
  observation?: string;
  warehouse: {
    _id: string;
    name: string;
    code: string;
  };
  employee: {
    _id: string;
    name: string;
    email: string;
    rol?: string;
    company?: string;
    area?: string;
  };
  approver?: {
    _id: string;
    name: string;
    email: string;
  };
  bosses?: Array<{
    _id: string;
    name?: string;
  }>;
  epps: RequestEpp[];
  approvalToken?: string;
  approveDate?: Date | string;
  deliveryToken?: string;
  deliveryDate?: Date | string;
  date: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateRequestDTO {
  reason: 'Deterioro' | 'Reposición' | 'Nuevo Ingreso' | 'Otro';
  special?: boolean;
  observation?: string;
  warehouse: string;
  epps: Array<{
    epp: string;
    quantity: number;
  }>;
}

export interface UpdateRequestDTO {
  reason?: 'Deterioro' | 'Reposición' | 'Nuevo Ingreso' | 'Otro';
  special?: boolean;
  observation?: string;
  warehouse?: string;
  epps?: Array<{
    epp: string;
    quantity: number;
  }>;
}

export interface RequestFilters {
  page?: number;
  limit?: number;
  status?: 'Pendiente' | 'Aprobado' | 'Entregado' | 'Rechazado';
  reason?: 'Deterioro' | 'Reposición' | 'Nuevo Ingreso' | 'Otro';
  employeeId?: string;
  search?: string;
}

export interface RequestsResponse {
  success: boolean;
  data: Request[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  rol: string;
  company?: {
    _id: string;
    name: string;
  };
  area?: {
    _id: string;
    name: string;
  };
  position?: {
    _id: string;
    name: string;
  };
  disabled: boolean;
}

export interface TeamMembersResponse {
  success: boolean;
  data: TeamMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
